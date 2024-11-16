'use client';

import { Card, CardHeader, CardBody, Button, Badge, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, NextUIProvider } from '@nextui-org/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface YoutubeStats {
  id: string;
  movieId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  date: string;
}

interface Movie {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: 'draft' | 'uploaded' | 'published';
  scriptId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  script: {
    id: string;
    title: string;
  } | null;
  youtubeStats: YoutubeStats[];
}

export default function MovieListPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 動画データの取得
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error('動画の取得に失敗しました');
        }
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (err) {
        console.error('動画取得エラー:', err);
        setMovies([]); // エラー時は空配列を設定
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleCreateNew = () => {
    router.push('/business/dashboard');
  };




  const handleDelete = async (movieId: string) => {
    if (!confirm('この動画を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('動画の削除に失敗しました');
      }

      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('動画削除エラー:', err);
      // エラー処理を追加
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'uploaded':
        return 'warning';
      case 'published':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '未編集';
      case 'uploaded':
        return 'アップロード済み';
      case 'published':
        return '公開済み';
      default:
        return status;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-white">
        <div className="flex">
          <div className="container mx-auto px-4 py-8">
            <Card className="w-full">
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-bold">過去の動画一覧</h1>
                <div className="flex gap-2">
                  <Button 
                    color="primary" 
                    onPress={handleCreateNew}
                  >
                    新規動画作成
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {movies.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">動画がありません。新しい動画を作成してください。</p>
                  </div>
                ) : (
                  <Table aria-label="動画一覧">
                    <TableHeader>
                      <TableColumn>タイトル</TableColumn>
                      <TableColumn>撮影日</TableColumn>
                      <TableColumn>ステータス</TableColumn>
                      <TableColumn>視聴回数</TableColumn>
                      <TableColumn>アクション</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {movies.map((movie) => (
                        <TableRow key={movie.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              {movie.title}
                              {movie.script && (
                                <Link 
                                  href={`/business/scripts/${movie.script.id}`}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  台本を表示
                                </Link>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(movie.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge color={getStatusColor(movie.status)}>
                              {getStatusText(movie.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {movie.youtubeStats[0]?.views.toLocaleString() ?? '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                color="primary"
                                onPress={() => handleEdit(movie)}
                              >
                                編集
                              </Button>
                              {movie.status === 'published' && (
                                <Button size="sm" color="secondary">
                                  分析
                                </Button>
                              )}
                              <Button
                                size="sm"
                                color="danger"
                                onPress={() => handleDelete(movie.id)}
                              >
                                削除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
