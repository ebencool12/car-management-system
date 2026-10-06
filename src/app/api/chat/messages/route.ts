import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { externalizeDataUrl } from '@/lib/chat-media-store';

function getStorageFile(): string {
  const local = path.join(process.cwd(), '.byt-chat-storage.json');
  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    return local;
  } catch {
    return path.join('/tmp', '.byt-chat-storage.json');
  }
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'driver' | 'admin';
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  deliveredAt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'driver_1_admin',
    senderId: 'admin',
    senderName: 'Emma (Admin Dispatch)',
    senderRole: 'admin',
    recipientId: '1',
    content: 'Good morning Kwame, please remember routine service inspection is due for GR-1234-22 next week.',
    createdAt: '2026-09-14T08:00:00',
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'driver_1_admin',
    senderId: '1',
    senderName: 'Kwame Asante',
    senderRole: 'driver',
    recipientId: 'admin',
    content: 'Good morning dispatch. Received! I will bring it in on Monday afternoon.',
    createdAt: '2026-09-14T08:15:00',
    read: true,
  },
  {
    id: 'msg-3',
    conversationId: 'driver_1_admin',
    senderId: 'admin',
    senderName: 'Emma (Admin Dispatch)',
    senderRole: 'admin',
    recipientId: '1',
    content: 'Sounds good! Also note that sales remittances can now be paid directly via MTN MoMo or Card prompt.',
    createdAt: '2026-09-14T08:20:00',
    read: true,
  },
];

let serverMemoryMessages: ChatMessage[] | null = null;

function normalizeDriverId(id: string): string {
  if (!id) return id;
  if (/^d\d+$/.test(id)) return id.substring(1);
  return id;
}

function normalizeConversationId(convId: string): string {
  if (!convId) return convId;
  if (/^c\d+$/.test(convId)) {
    return `driver_${convId.substring(1)}_admin`;
  }
  return convId;
}

/** Move inline base64 attachments into files; returns true if anything changed */
function externalizeMessagesMedia(messages: ChatMessage[]): boolean {
  let changed = false;
  messages.forEach(m => {
    if (m.mediaUrl && m.mediaUrl.startsWith('data:')) {
      const url = externalizeDataUrl(m.id, m.mediaUrl);
      if (url && url !== m.mediaUrl) {
        m.mediaUrl = url;
        changed = true;
      }
    }
  });
  return changed;
}

function getDiskMessages(): ChatMessage[] {
  if (serverMemoryMessages !== null) {
    return serverMemoryMessages;
  }
  const filePath = getStorageFile();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        serverMemoryMessages = parsed;
        if (externalizeMessagesMedia(parsed)) {
          saveDiskMessages(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading chat storage file:', err);
  }
  serverMemoryMessages = [...DEFAULT_MESSAGES];
  saveDiskMessages(serverMemoryMessages);
  return serverMemoryMessages;
}

function saveDiskMessages(messages: ChatMessage[]) {
  serverMemoryMessages = messages;
  const filePath = getStorageFile();
  try {
    fs.writeFileSync(filePath, JSON.stringify(messages), 'utf-8');
  } catch (err) {
    // Non-fatal on serverless (e.g. read-only file systems)
  }
}

export async function GET() {
  const map = new Map<string, ChatMessage>();

  // 1. Seed with disk/memory messages
  const diskMessages = getDiskMessages();
  diskMessages.forEach(m => map.set(m.id, m));

  // 2. Supplement and refresh with persistent Supabase PostgreSQL cloud messages
  try {
    const { createSupabaseServerClient } = await import('@/lib/supabase');
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      data.forEach(m => {
        const convId = normalizeConversationId(m.conversation_id);
        const senderId = normalizeDriverId(m.sender_id);
        let recipientId = 'admin';
        if (m.sender_type === 'admin') {
          const match = convId.match(/driver_([^_]+)_admin/);
          recipientId = match ? match[1] : '1';
        }

        const existing = map.get(m.id);
        map.set(m.id, {
          id: m.id,
          conversationId: convId,
          senderId: senderId,
          senderName: m.sender_name || (m.sender_type === 'admin' ? 'Emma (Admin Dispatch)' : 'Driver'),
          senderRole: m.sender_type as 'driver' | 'admin',
          recipientId: existing?.recipientId || recipientId,
          content: m.content,
          createdAt: m.created_at,
          read: Boolean(m.is_read),
          mediaUrl: m.media_url || existing?.mediaUrl || undefined,
          mediaType: (m.media_type as ChatMessage['mediaType']) || existing?.mediaType,
        });
      });
    }
  } catch (err) {
    console.warn('Supabase chat messages fetch error:', err);
  }

  const messages = Array.from(map.values());
  messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return NextResponse.json({ success: true, messages, source: 'merged' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getDiskMessages();
    const map = new Map<string, ChatMessage>();

    // Index existing messages
    current.forEach(m => map.set(m.id, m));

    const incomingList: ChatMessage[] = [];
    if (body.message && body.message.id) {
      incomingList.push(body.message);
    }
    if (Array.isArray(body.messages)) {
      body.messages.forEach((m: ChatMessage) => {
        if (m && m.id && !incomingList.some(i => i.id === m.id)) {
          incomingList.push(m);
        }
      });
    }

    incomingList.forEach(m => {
      m.mediaUrl = externalizeDataUrl(m.id, m.mediaUrl);
      map.set(m.id, m);
    });

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    saveDiskMessages(merged);

    // Persist new messages to Supabase PostgreSQL cloud database
    try {
      const { createSupabaseServerClient } = await import('@/lib/supabase');
      const supabase = createSupabaseServerClient();

      for (const msg of incomingList) {
        if (!msg.content && !msg.mediaUrl) continue;
        const convId = msg.conversationId || `driver_${msg.senderId || '1'}_admin`;

        let driverId = '1';
        const driverMatch = convId.match(/driver_([^_]+)_admin/);
        if (driverMatch) {
          driverId = driverMatch[1];
        } else if (msg.senderRole === 'driver') {
          driverId = String(msg.senderId || '1');
        }

        // Ensure driver exists in drivers table (prevents FK error 23503)
        try {
          await supabase.from('drivers').upsert({
            id: driverId,
            name: msg.senderRole === 'driver' ? msg.senderName : `Driver ${driverId}`,
            phone: `024-000-${driverId.padStart(4, '0')}`,
            status: 'ACTIVE'
          }, { onConflict: 'id' });
        } catch {}

        // Ensure conversation exists in chat_conversations table
        try {
          await supabase.from('chat_conversations').upsert({
            id: convId,
            driver_id: driverId,
            driver_name: msg.senderRole === 'driver' ? msg.senderName : 'Fleet Driver',
            last_message: msg.content || 'Attachment',
            last_message_at: msg.createdAt || new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch {}

        // Persist message
        try {
          await supabase.from('chat_messages').upsert({
            id: msg.id,
            conversation_id: convId,
            sender_id: String(msg.senderId),
            sender_name: msg.senderName,
            sender_type: msg.senderRole,
            content: msg.content || '',
            media_url: msg.mediaUrl || null,
            media_type: msg.mediaType || null,
            is_read: Boolean(msg.read),
            created_at: msg.createdAt || new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch (err) {
          console.warn('Supabase chat message insert warning:', err);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase chat message write warning:', sbErr);
    }

    return NextResponse.json({ success: true, count: incomingList.length, messages: merged });
  } catch (err) {
    console.error('Error saving chat message:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getDiskMessages();
    const { conversationId, currentUserId, readAt } = body;
    let changed = false;
    const uId = String(currentUserId || '');
    const nowIso = readAt || new Date().toISOString();

    const updated = current.map(m => {
      if (
        (m.conversationId === conversationId || (uId === 'admin' && m.recipientId === 'admin')) &&
        String(m.recipientId) === uId &&
        !m.read
      ) {
        changed = true;
        return { ...m, read: true, readAt: m.readAt || nowIso };
      }
      return m;
    });

    if (changed) {
      saveDiskMessages(updated);
    }

    // Update in Supabase
    try {
      const { createSupabaseServerClient } = await import('@/lib/supabase');
      const supabase = createSupabaseServerClient();
      if (conversationId) {
        await supabase
          .from('chat_messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId);
      }
    } catch (sbErr) {
      console.warn('Supabase patch read status warning:', sbErr);
    }

    return NextResponse.json({ success: true, messages: updated });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

