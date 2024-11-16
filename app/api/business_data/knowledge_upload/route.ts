import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { analyzeContent } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'ファイルが必要です' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: 'public',
      });
      return blob.url;
    });

    const fileUrls = await Promise.all(uploadPromises);

    // ファイルの内容を解析してカテゴリ、サブカテゴリ、タグを生成
    const fileContents = await Promise.all(
      files.map(async (file) => {
        const text = await file.text();
        return text;
      })
    );

    const combinedContent = fileContents.join('\n\n');
    const analysis = await analyzeContent(combinedContent);

    return NextResponse.json({
      fileUrls,
      category: analysis.category,
      subCategory: analysis.subCategory,
      tags: analysis.tags,
    });

  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
