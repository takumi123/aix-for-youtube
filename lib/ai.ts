import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisResult {
  category: string;
  subCategory: string;
  tags: string[];
}

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  try {
    const prompt = `
以下のコンテンツを解析して、カテゴリ、サブカテゴリ、関連するタグを抽出してください。
JSONフォーマットで返してください。

コンテンツ:
${content}

期待する出力フォーマット:
{
  "category": "メインカテゴリ",
  "subCategory": "サブカテゴリ",
  "tags": ["タグ1", "タグ2", "タグ3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたはコンテンツ分析の専門家です。与えられたテキストを解析して、適切なカテゴリとタグを提案します。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      category: result.category || '',
      subCategory: result.subCategory || '',
      tags: result.tags || [],
    };
  } catch (error) {
    console.error('コンテンツ解析エラー:', error);
    return {
      category: '',
      subCategory: '',
      tags: [],
    };
  }
}
