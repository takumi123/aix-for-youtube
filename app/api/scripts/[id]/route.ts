import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    const { title, content, status } = await request.json();

    // スクリプトの所有者確認
    const existingScript = await prisma.script.findUnique({
      where: { id: params.id },
    });

    if (!existingScript) {
      return NextResponse.json({ error: 'スクリプトが見つかりません' }, { status: 404 });
    }

    if (existingScript.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const updatedScript = await prisma.script.update({
      where: { id: params.id },
      data: {
        title,
        content,
        status,
      },
    });

    return NextResponse.json(updatedScript);
  } catch (error) {
    console.error('スクリプト更新エラー:', error);
    return NextResponse.json(
      { error: 'スクリプトの更新に失敗しました' },
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

    // スクリプトの所有者確認
    const existingScript = await prisma.script.findUnique({
      where: { id: params.id },
    });

    if (!existingScript) {
      return NextResponse.json({ error: 'スクリプトが見つかりません' }, { status: 404 });
    }

    if (existingScript.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    await prisma.script.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'スクリプトを削除しました' });
  } catch (error) {
    console.error('スクリプト削除エラー:', error);
    return NextResponse.json(
      { error: 'スクリプトの削除に失敗しました' },
      { status: 500 }
    );
  }
}

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

    const script = await prisma.script.findUnique({
      where: { id: params.id },
    });

    if (!script) {
      return NextResponse.json({ error: 'スクリプトが見つかりません' }, { status: 404 });
    }

    if (script.userId !== user.id) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error('スクリプト取得エラー:', error);
    return NextResponse.json(
      { error: 'スクリプトの取得に失敗しました' },
      { status: 500 }
    );
  }
}
