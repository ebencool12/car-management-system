import fs from 'fs';
import path from 'path';

/**
 * Server-side file storage for chat attachments (voice notes, images, documents).
 * Keeps large base64 payloads out of the JSON message store so polling stays fast.
 */
export const MEDIA_DIR = path.join(process.cwd(), '.byt-chat-media');

const MIME_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/mpeg': 'mp3',
  'video/webm': 'webm',
  'video/mp4': 'mp4',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

const EXT_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_EXT).map(([mime, ext]) => [ext, mime])
);

export function mimeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_MIME[ext] || 'application/octet-stream';
}

/** Only allow plain file names (no path traversal) */
export function isSafeFilename(name: string): boolean {
  return /^[A-Za-z0-9._-]+$/.test(name) && !name.includes('..');
}

/**
 * If `mediaUrl` is an inline data: URL, write it to disk and return the API URL that serves it.
 * Returns the original value untouched for anything else (or if writing fails).
 */
export function externalizeDataUrl(messageId: string, mediaUrl: string | undefined): string | undefined {
  if (!mediaUrl || !mediaUrl.startsWith('data:')) return mediaUrl;
  const match = /^data:([^;,]+)((?:;[^;,]+)*?)(;base64)?,([\s\S]*)$/.exec(mediaUrl);
  if (!match) return mediaUrl;

  const mime = match[1].toLowerCase();
  const isBase64 = Boolean(match[3]);
  const ext = MIME_EXT[mime] || 'bin';
  const safeId = messageId.replace(/[^A-Za-z0-9_-]/g, '_');
  const filename = `${safeId}.${ext}`;

  try {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
    const buffer = isBase64
      ? Buffer.from(match[4], 'base64')
      : Buffer.from(decodeURIComponent(match[4]), 'utf-8');
    fs.writeFileSync(path.join(MEDIA_DIR, filename), buffer);
    return `/api/chat/media/${filename}`;
  } catch (err) {
    console.error('Failed to store chat media:', err);
    return mediaUrl;
  }
}
