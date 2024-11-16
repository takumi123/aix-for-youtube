'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  publishedAt: string;
  tags?: string[];
}

interface SearchResults {
  searchQuery: string;
  totalResults: number;
  channels: Channel[];
  videos: Video[];
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('検索キーワードを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/youtube/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '検索に失敗しました');
      }

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube リサーチ</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="検索キーワードを入力"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {searchResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">検索結果概要</h4>
            </CardHeader>
            <CardBody>
              <p>検索キーワード: {searchResults.searchQuery}</p>
              <p>総検索結果数: {searchResults.totalResults}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">チャンネル情報</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.channels.map((channel: Channel) => (
                  <div key={channel.id} className="border rounded-lg p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={channel.thumbnail}
                      alt={channel.title}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                    <h5 className="font-bold mt-2">{channel.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                    <div className="mt-2">
                      <p>登録者数: {channel.subscriberCount}</p>
                      <p>総視聴回数: {channel.viewCount}</p>
                      <p>動画数: {channel.videoCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">動画一覧</h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {searchResults.videos.map((video: Video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        width={192}
                        height={108}
                        className="object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold">{video.title}</h5>
                        <p className="text-sm text-gray-600">{video.channelTitle}</p>
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
                        {video.tags && video.tags.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">タグ:</p>
                            <div className="flex flex-wrap gap-1">
                              {video.tags.map((tag: string, index: number) => (
                                <span key={index} className="text-xs bg-gray-100 rounded px-2 py-1">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
