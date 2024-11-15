'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Switch, Button, Tabs, Tab, Select, SelectItem } from '@nextui-org/react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("account");
  
  // 通知設定
  const [notifications, setNotifications] = useState({
    youtubeUpload: true,
    editingComplete: true,
    analytics: false
  });

  // YouTube公開設定
  const [youtubeSettings, setYoutubeSettings] = useState({
    defaultPrivacy: 'private',
    autoUpload: false
  });

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
        
        setErrorMessage(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      }
    };

    fetchYouTubeStats();
  }, [session, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">設定</h1>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {errorMessage}
        </div>
      )}

      <Tabs 
        selectedKey={selectedTab} 
        onSelectionChange={(key) => setSelectedTab(key.toString())}
        className="mb-6"
      >
        <Tab key="account" title="アカウント設定">
          {session?.user && (
            <Card className="w-full mb-4">
              <CardHeader className="pb-0 pt-2 px-4">
                <h4 className="text-lg font-bold">ユーザー情報</h4>
              </CardHeader>
              <CardBody>
                <div className="flex items-center gap-4">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
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
        </Tab>

        <Tab key="youtube" title="YouTube連携">
          <Card className="w-full mb-4">
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">YouTube設定</h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-2">デフォルト公開設定</p>
                  <Select
                    value={youtubeSettings.defaultPrivacy}
                    onChange={(e) => setYoutubeSettings(prev => ({
                      ...prev,
                      defaultPrivacy: e.target.value
                    }))}
                  >
                    <SelectItem key="public" value="public">公開</SelectItem>
                    <SelectItem key="unlisted" value="unlisted">限定公開</SelectItem>
                    <SelectItem key="private" value="private">非公開</SelectItem>
                  </Select>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">自動アップロード</p>
                    <p className="text-sm text-gray-600">編集完了後に自動でYouTubeに投稿</p>
                  </div>
                  <Switch
                    checked={youtubeSettings.autoUpload}
                    onChange={(e) => setYoutubeSettings(prev => ({
                      ...prev,
                      autoUpload: e.target.checked
                    }))}
                  />
                </div>

                {stats && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">チャンネル統計</h5>
                    <div className="grid grid-cols-3 gap-4">
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
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="notifications" title="通知設定">
          <Card className="w-full mb-4">
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">メール通知設定</h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">YouTubeアップロード通知</p>
                    <p className="text-sm text-gray-600">動画がYouTubeに公開された時</p>
                  </div>
                  <Switch
                    checked={notifications.youtubeUpload}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      youtubeUpload: e.target.checked
                    }))}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">編集完了通知</p>
                    <p className="text-sm text-gray-600">動画の編集が完了した時</p>
                  </div>
                  <Switch
                    checked={notifications.editingComplete}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      editingComplete: e.target.checked
                    }))}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">分析レポート通知</p>
                    <p className="text-sm text-gray-600">週次の動画パフォーマンスレポート</p>
                  </div>
                  <Switch
                    checked={notifications.analytics}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      analytics: e.target.checked
                    }))}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="billing" title="支払い管理">
          <Card className="w-full mb-4">
            <CardHeader className="pb-0 pt-2 px-4">
              <h4 className="text-lg font-bold">支払い情報</h4>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <h5 className="font-medium mb-4">現在のプラン</h5>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-bold text-lg">スタンダードプラン</p>
                    <p className="text-sm text-gray-600">¥15,000 / 月</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-4">請求履歴</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">2024年1月分</p>
                        <p className="text-sm text-gray-600">スタンダードプラン</p>
                      </div>
                      <p className="font-medium">¥15,000</p>
                    </div>
                    <div className="flex justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">2023年12月分</p>
                        <p className="text-sm text-gray-600">スタンダードプラン</p>
                      </div>
                      <p className="font-medium">¥15,000</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-4">お支払い方法</h5>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-gray-100 p-2 rounded">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">クレジットカード</p>
                      <p className="text-sm text-gray-600">**** **** **** 4242</p>
                    </div>
                  </div>
                  <Button color="primary" variant="flat" className="mt-4">
                    支払い方法を変更
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
