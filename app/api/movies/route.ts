import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
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

    const movies = await prisma.movie.findMany({
      where: { userId: user.id },
      include: {
        script: true,
        youtubeStats: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error('動画取得エラー:', error);
    return NextResponse.json(
      { error: '動画の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const { title, description, videoUrl, thumbnailUrl, scriptId } = await request.json();

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        scriptId,
        userId: user.id,
      },
      include: {
        script: true,
      },
    });

    return NextResponse.json(movie);
  } catch (error) {
    console.error('動画作成エラー:', error);
    return NextResponse.json(
      { error: '動画の作成に失敗しました' },
      { status: 500 }
    );
  }
}
