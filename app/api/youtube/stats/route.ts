import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from 'next-auth';

interface GoogleApiError {
  response?: {
    status: number;
  };
  message: string;
}

export async function GET() {
  try {
    // セッションを取得
    const session = await getServerSession(authOptions) as Session;
    
    // デバッグログ出力
    console.log('セッション情報:', session);

    if (!session?.user?.accessToken) {
      throw new Error('アクセストークンが見つかりません。再度ログインしてください。');
    }

    // OAuth2クライアントを初期化
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
    );

    try {
      // アクセストークンを設定
      oauth2Client.setCredentials({
        access_token: session.user.accessToken,
        refresh_token: session.user.refreshToken
      });

      // トークンの有効性を確認
      await oauth2Client.getTokenInfo(session.user.accessToken);
    } catch (tokenError) {
      const error = tokenError as GoogleApiError;
      // トークンが無効な場合は、リフレッシュトークンを使用して更新を試みる
      if (error.response?.status === 401 && session.user.refreshToken) {
        try {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
        } catch {
          throw new Error('トークンの更新に失敗しました。再度ログインしてください。');
        }
      } else {
        throw error;
      }
    }

    // YouTube Data APIクライアントを初期化
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // チャンネル統計情報を取得
    const channelResponse = await youtube.channels.list({
      part: ['statistics', 'snippet'],
      mine: true
    });

    // チャンネル情報が存在しない場合はエラー
    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('YouTubeチャンネル情報が見つかりません');
    }

    const channel = channelResponse.data.items[0];
    const statistics = channel.statistics;
    const snippet = channel.snippet;

    // 動画一覧を取得
    const videosResponse = await youtube.search.list({
      part: ['id'],
      channelId: channel.id ?? undefined,
      order: 'date',
      maxResults: 10,
      type: ['video']
    });

    const videoIds = videosResponse.data.items?.map(item => item.id?.videoId || '') || [];

    // 動画の詳細情報を取得
    const videosDetailsResponse = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: videoIds
    });

    const videos = videosDetailsResponse.data.items?.map(video => ({
      id: video.id,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
      thumbnail: video.snippet?.thumbnails?.medium?.url || ''
    }));

    // 統計情報とチャンネル情報をレスポンス
    return NextResponse.json({
      channelTitle: snippet?.title || 'チャンネル名なし',
      channelDescription: snippet?.description || '説明なし',
      subscriberCount: statistics?.subscriberCount || '0',
      viewCount: statistics?.viewCount || '0', 
      videoCount: statistics?.videoCount || '0',
      publishedAt: snippet?.publishedAt || '不明',
      videos: videos
    });

  } catch (error) {
    console.error('YouTube API エラー:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error 
          ? `YouTubeデータの取得に失敗しました: ${error.message}` 
          : '予期せぬエラーが発生しました'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
