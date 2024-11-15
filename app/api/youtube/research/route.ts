import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.accessToken) {
      throw new Error('アクセストークンが見つかりません。再度ログインしてください。');
    }

    const { searchQuery } = await request.json();

    if (!searchQuery) {
      throw new Error('検索キーワードが指定されていません。');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
    );

    oauth2Client.setCredentials({
      access_token: session.user.accessToken
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });

    // 検索結果を取得
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: searchQuery,
      type: ['video'],
      maxResults: 50,
      order: 'relevance'
    });

    if (!searchResponse.data.items) {
      throw new Error('検索結果が見つかりません');
    }

    const videoIds = searchResponse.data.items.map(item => item.id?.videoId || '');

    // 動画の詳細情報を取得
    const videosDetailsResponse = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: videoIds
    });

    const videos = videosDetailsResponse.data.items?.map(video => ({
      id: video.id,
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      publishedAt: video.snippet?.publishedAt || '',
      channelId: video.snippet?.channelId || '',
      channelTitle: video.snippet?.channelTitle || '',
      viewCount: video.statistics?.viewCount || '0',
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
      duration: video.contentDetails?.duration || '',
      thumbnail: video.snippet?.thumbnails?.medium?.url || '',
      tags: video.snippet?.tags || [],
    }));

    // チャンネル情報を取得
    const channelIds = [...new Set(videos?.map(video => video.channelId) || [])];
    const channelsResponse = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      id: channelIds
    });

    const channels = channelsResponse.data.items?.map(channel => ({
      id: channel.id,
      title: channel.snippet?.title || '',
      description: channel.snippet?.description || '',
      subscriberCount: channel.statistics?.subscriberCount || '0',
      videoCount: channel.statistics?.videoCount || '0',
      viewCount: channel.statistics?.viewCount || '0',
      thumbnail: channel.snippet?.thumbnails?.medium?.url || '',
    }));

    return NextResponse.json({
      searchQuery,
      totalResults: searchResponse.data.pageInfo?.totalResults || 0,
      videos,
      channels
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
