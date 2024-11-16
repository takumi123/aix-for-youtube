import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const knowledge = await prisma.knowledge.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('ナレッジ更新エラー:', error);
    return NextResponse.json(
      { error: 'ナレッジの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.knowledge.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ナレッジ削除エラー:', error);
    return NextResponse.json(
      { error: 'ナレッジの削除に失敗しました' },
      { status: 500 }
    );
  }
}
