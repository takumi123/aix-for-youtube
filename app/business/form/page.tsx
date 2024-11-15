'use client';

import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, NextUIProvider } from '@nextui-org/react';
import Header from '../../components/Header';
import Sidebar from '../../components/Business_Sidebar';
import Footer from '../../components/Footer';

interface Script {
  id: string;
  title: string;
  date: string;
  status: '編集中' | 'アップロード済み';
  improvements?: string[];
}

export default function ScriptListPage() {
  const { data: session } = useSession();

  // サンプルデータ
  const scripts: Script[] = [
    {
      id: '1',
      title: '効果的なクライアント集客方法',
      date: '2024-01-15',
      status: 'アップロード済み',
      improvements: [
        'キーワードの最適化',
        '構成の改善',
        'エンゲージメント向上のための工夫'
      ]
    },
    {
      id: '2',
      title: 'ビジネス成長戦略',
      date: '2024-01-14',
      status: '編集中',
      improvements: [
        'ターゲット層の明確化',
        '具体例の追加'
      ]
    }
  ];

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-white">
        <Header 
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          userImage={session?.user?.image}
        />
        <div className="flex">
          <div className="mr-4">
            <Sidebar />
          </div>
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-bold">台本一覧</h1>
                <div className="flex gap-2">
                  <Button color="primary">
                    新規台本作成
                  </Button>
                  <Button color="secondary" variant="flat">
                    AIアシスタント
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table aria-label="台本一覧">
                  <TableHeader>
                    <TableColumn>タイトル</TableColumn>
                    <TableColumn>作成日</TableColumn>
                    <TableColumn>ステータス</TableColumn>
                    <TableColumn>AI改善提案</TableColumn>
                    <TableColumn>アクション</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.title}</TableCell>
                        <TableCell>{script.date}</TableCell>
                        <TableCell>
                          <Badge color={script.status === 'アップロード済み' ? 'success' : 'warning'}>
                            {script.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {script.improvements && (
                            <div className="flex flex-wrap gap-1">
                              {script.improvements.map((improvement, index) => (
                                <Badge key={index} color="primary" variant="flat" size="sm">
                                  {improvement}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" color="primary">
                              編集
                            </Button>
                            <Button size="sm" color="secondary">
                              AI分析
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            {/* AI台本作成セクション */}
            <Card className="mt-8">
              <CardHeader className="px-6 py-4">
                <h2 className="text-xl font-bold">AI台本作成アシスタント</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">AIによる台本作成のポイント</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                      <li>ターゲット層に合わせた内容の最適化</li>
                      <li>SEOを意識したキーワードの選定</li>
                      <li>視聴者の興味を引く構成</li>
                      <li>エンゲージメント向上のための工夫</li>
                    </ul>
                  </div>
                  <Button color="primary" className="w-full">
                    AIで新規台本を作成
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </NextUIProvider>
  );
}
