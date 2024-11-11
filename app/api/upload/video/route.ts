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
    const filename = `video_${timestamp}.webm`;

    // WebMファイルを直接アップロード
    const blob = await put(filename, request.body, {
      access: 'public',
      contentType: 'video/webm'
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
