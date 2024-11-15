import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Readable } from 'stream';

// Web用のReadableStreamをNode.jsのReadableに変換する関数
function readableFromWeb(webStream: ReadableStream) {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error) {
        this.destroy(error as Error);
      }
    }
  });
}

export async function POST(req: Request) {
  try {
    // Content-Typeの確認
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be multipart/form-data' }),
        { status: 400 }
      );
    }

    // FormDataの取得
    const formData = await req.formData();
    const file = formData.get('file');
    const thumbnail = formData.get('thumbnail');
    const title = formData.get('title');
    const description = formData.get('description');

    // ファイルの存在確認
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'ファイルが提供されていません' }),
        { status: 400 }
      );
    }

    // ファイルのストリームを取得
    const stream = file.stream();
    const mimeType = file.type;

    // セッションの取得
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ファイル形式の検証
    if (!mimeType.includes('mp4')) {
      return NextResponse.json(
        { error: 'MP4形式の動画ファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // サムネイルの形式検証
    if (thumbnail && thumbnail instanceof File) {
      const thumbnailType = thumbnail.type;
      if (!['image/jpeg', 'image/png'].includes(thumbnailType)) {
        return NextResponse.json(
          { error: 'サムネイルはJPEGまたはPNG形式のみ対応しています' },
          { status: 400 }
        );
      }
    }

    // OAuth2クライアントの設定
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // アクセストークンの設定
    oauth2Client.setCredentials({
      access_token: session.user.accessToken,
    });

    // YouTube APIの初期化
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // WebストリームをNode.jsのReadableStreamに変換
    const nodeStream = readableFromWeb(stream);

    // 動画のアップロード
    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: title as string,
          description: description as string,
          categoryId: '22', // デフォルトカテゴリ
          tags: [], // タグを追加する場合はここに配列で指定
          defaultLanguage: 'ja' // 日本語を指定
        },
        status: {
          privacyStatus: 'private', // 初期設定は非公開に
          selfDeclaredMadeForKids: false // 子供向けコンテンツではない
        }
      },
      media: {
        body: nodeStream,
        mimeType: 'video/mp4'
      }
    });

    if (!res.data || !res.data.id) {
      throw new Error('動画のアップロードに失敗しました');
    }

    // サムネイルのアップロード
    if (thumbnail && thumbnail instanceof File) {
      const thumbnailStream = readableFromWeb(thumbnail.stream());
      await youtube.thumbnails.set({
        videoId: res.data.id,
        media: {
          body: thumbnailStream,
          mimeType: thumbnail.type
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      videoId: res.data.id,
      message: '動画が非公開でアップロードされました'
    });

  } catch (error: unknown) {
    console.error('YouTube動画アップロードエラー:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '動画のアップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
