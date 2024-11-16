import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        script: true,
        youtubeStats: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!movie) {
      return NextResponse.json({ error: '動画が見つかりません' }, { status: 404 });
    }

    if (movie.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('動画取得エラー:', error);
    return NextResponse.json(
      { error: '動画の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const { title, description, status } = await request.json();

    // 動画の所有者確認
    const existingMovie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: '動画が見つかりません' }, { status: 404 });
    }

    if (existingMovie.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
      },
      include: {
        script: true,
        youtubeStats: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        }
      }
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('動画更新エラー:', error);
    return NextResponse.json(
      { error: '動画の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 動画の所有者確認
    const existingMovie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!existingMovie) {
      return NextResponse.json({ error: '動画が見つかりません' }, { status: 404 });
    }

    if (existingMovie.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    // 関連するYouTube統計データも削除
    await prisma.youtubeStats.deleteMany({
      where: { movieId: params.id },
    });

    // 動画を削除
    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '動画を削除しました' });
  } catch (error) {
    console.error('動画削除エラー:', error);
    return NextResponse.json(
      { error: '動画の削除に失敗しました' },
      { status: 500 }
    );
  }
}
