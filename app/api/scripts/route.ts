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

    const scripts = await prisma.script.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(scripts);
  } catch (error) {
    console.error('スクリプト取得エラー:', error);
    return NextResponse.json(
      { error: 'スクリプトの取得に失敗しました' },
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

    const { title, content } = await request.json();

    const script = await prisma.script.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(script);
  } catch (error) {
    console.error('スクリプト作成エラー:', error);
    return NextResponse.json(
      { error: 'スクリプトの作成に失敗しました' },
      { status: 500 }
    );
  }
}
