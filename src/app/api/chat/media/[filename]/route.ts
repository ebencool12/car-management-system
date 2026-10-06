import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MEDIA_DIR, isSafeFilename, mimeFromFilename } from '@/lib/chat-media-store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!isSafeFilename(filename)) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  const filePath = path.join(MEDIA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const data = fs.readFileSync(filePath);
  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': mimeFromFilename(filename),
      'Content-Length': String(data.length),
      // Media files are immutable (named by unique message id)
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  });
}
