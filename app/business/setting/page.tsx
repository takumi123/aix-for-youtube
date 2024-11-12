'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface YouTubeStats {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  channelTitle: string;
  channelDescription: string;
  publishedAt: string;
  videos?: Array<{
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    thumbnail: string;
  }>;
}

export default function SettingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<YouTubeStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchYouTubeStats = async () => {
      try {
        const response = await fetch('/api/youtube/stats', {
          headers: {
            'Authorization': `Bearer ${session?.user?.accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login');
            return;
          }
          throw new Error('YouTube統計情報の取得に失敗しました');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('No access, refresh token')) {
          router.push('/auth/login');
          return;
        }
        
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      }
    };

    fetchYouTubeStats();
  }, [session, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">YouTubeチャンネル統計</h1>
      {session?.user && (
        <Card className="w-full mb-4">
          <CardHeader className="pb-0 pt-2 px-4">
            <h4 className="text-lg font-bold">ユーザー情報</h4>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">名前</p>
                <p className="font-bold">{session.user.name}</p>
                <p className="text-sm text-gray-600 mt-2">メールアドレス</p>
                <p className="font-bold">{session.user.email}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
      
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : !stats ? (
        <div>読み込み中...</div>
      ) : (
        <>
          <Card className="w-full mb-4">
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">チャンネル概要</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">チャンネル登録者数</p>
                  <p className="text-xl font-bold">{stats.subscriberCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">総視聴回数</p>
                  <p className="text-xl font-bold">{stats.viewCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">動画本数</p>
                  <p className="text-xl font-bold">{stats.videoCount}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">チャンネル名</p>
                <p className="font-bold">{stats.channelTitle}</p>
                <p className="text-sm text-gray-600 mt-2">チャンネル説明</p>
                <p className="text-sm">{stats.channelDescription}</p>
                <p className="text-sm text-gray-600 mt-2">作成日</p>
                <p className="text-sm">{new Date(stats.publishedAt).toLocaleDateString('ja-JP')}</p>
              </div>
            </CardBody>
          </Card>

          {stats.videos && (
            <Card className="w-full">
              <CardHeader className="pb-0 pt-2 px-4">
                <h4 className="text-lg font-bold">最新動画一覧</h4>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {stats.videos.map(video => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <Image 
                          src={video.thumbnail}
                          alt={video.title}
                          width={192}
                          height={108}
                          className="object-cover rounded"
                        />
                        <div>
                          <h5 className="font-bold">{video.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                              <p className="text-sm text-gray-600">視聴回数</p>
                              <p className="font-bold">{video.viewCount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">高評価数</p>
                              <p className="font-bold">{video.likeCount}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">コメント数</p>
                              <p className="font-bold">{video.commentCount}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            投稿日: {new Date(video.publishedAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
