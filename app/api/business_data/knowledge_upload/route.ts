import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: 'リクエストボディが必要です' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `knowledge_${timestamp}`;

    // ファイルをアップロード
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: request.headers.get('content-type') || 'application/octet-stream'
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}
