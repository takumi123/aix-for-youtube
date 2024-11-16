'use client';

import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, NextUIProvider } from '@nextui-org/react';
import Link from 'next/link';

type VideoStatus = '未編集' | '編集中' | '編集完了' | 'アップロード済み';

interface Video {
  id: string;
  title: string;
  date: string;
  status: VideoStatus;
  views?: number;
  likes?: number;
  comments?: number;
  scriptId?: number;
}

export default function MovieListPage() {

  // サンプルデータ
  const videos: Video[] = [
    {
      id: '1',
      title: '効果的なクライアント集客方法',
      date: '2024-01-15',
      status: 'アップロード済み',
      views: 1200,
      likes: 45,
      comments: 8,
      scriptId: 2
    },
    {
      id: '2',
      title: 'ビジネス成長戦略',
      date: '2024-01-14',
      status: '編集完了',
      views: 0,
      likes: 0,
      comments: 0,
      scriptId: 1
    },
    {
      id: '3',
      title: 'マーケティング基礎講座',
      date: '2024-01-13',
      status: '編集中'
    }
  ];

  const getStatusColor = (status: VideoStatus) => {
    switch (status) {
      case '未編集':
        return 'default';
      case '編集中':
        return 'warning';
      case '編集完了':
        return 'success';
      case 'アップロード済み':
        return 'primary';
    }
  };

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-white">
        <div className="flex">
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-bold">過去の動画一覧</h1>
                <div className="flex gap-2">
                  <Button color="primary" variant="flat">
                    分析データを表示
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table aria-label="動画一覧">
                  <TableHeader>
                    <TableColumn>タイトル</TableColumn>
                    <TableColumn>撮影日</TableColumn>
                    <TableColumn>ステータス</TableColumn>
                    <TableColumn>視聴回数</TableColumn>
                    <TableColumn>アクション</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            {video.title}
                            {video.scriptId && (
                              <Link 
                                href={`/business/scripts/${video.scriptId}`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                台本を表示
                              </Link>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{video.date}</TableCell>
                        <TableCell>
                          <Badge color={getStatusColor(video.status)}>
                            {video.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {video.views !== undefined ? video.views.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" color="primary">
                              詳細
                            </Button>
                            {video.status === 'アップロード済み' && (
                              <Button size="sm" color="secondary">
                                分析
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            {/* コミュニケーションセクション */}
            <Card className="mt-8">
              <CardHeader className="px-6 py-4">
                <h2 className="text-xl font-bold">編集担当者とのコミュニケーション</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="font-medium">最新のメッセージ</p>
                        <p className="text-sm text-gray-600 mt-1">
                          編集作業が完了しました。ご確認をお願いいたします。
                        </p>
                      </div>
                      <Badge color="success">新着</Badge>
                    </div>
                  </div>
                  <Button color="primary" variant="flat" className="w-full">
                    メッセージを送信
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
