import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), '.byt-chat-storage.json');

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

function getDiskMessages(): ChatMessage[] {
  if (serverMemoryMessages !== null) {
    return serverMemoryMessages;
  }
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        serverMemoryMessages = parsed;
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
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing chat storage file:', err);
  }
}

export async function GET() {
  const messages = getDiskMessages();
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = getDiskMessages();
    const map = new Map<string, ChatMessage>();

    // Index existing messages
    current.forEach(m => map.set(m.id, m));

    // If single message provided
    if (body.message && body.message.id) {
      map.set(body.message.id, body.message);
    }

    // If batch/updated array provided
    if (Array.isArray(body.messages)) {
      body.messages.forEach((m: ChatMessage) => {
        if (m && m.id) {
          map.set(m.id, m);
        }
      });
    }

    const merged = Array.from(map.values());
    merged.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    saveDiskMessages(merged);
    return NextResponse.json({ success: true, messages: merged });
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
    return NextResponse.json({ success: true, messages: updated });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
