import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const knowledge = await prisma.knowledge.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('ナレッジ取得エラー:', error);
    return NextResponse.json(
      { error: 'ナレッジの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const knowledge = await prisma.knowledge.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags,
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('ナレッジ作成エラー:', error);
    return NextResponse.json(
      { error: 'ナレッジの作成に失敗しました' },
      { status: 500 }
    );
  }
}
