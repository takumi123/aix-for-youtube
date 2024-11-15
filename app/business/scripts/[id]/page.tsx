'use client';

import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";

// Temporary mock data - replace with actual API call later
const scriptData = {
  id: 1,
  title: "商品紹介動画 #1",
  status: "editing",
  createdAt: "2024-01-15",
  content: `# 動画台本

## 導入部分
こんにちは、[会社名]の[名前]です。
今回は、弊社の新商品についてご紹介させていただきます。

## 本編
### 1. 商品の特徴
- 特徴1: 革新的な技術を採用
- 特徴2: 使いやすさを追求
- 特徴3: 高いコストパフォーマンス

### 2. 使用方法
1. まずは電源を入れます
2. モードを選択します
3. スタートボタンを押すだけ

## まとめ
以上が新商品の紹介でした。
詳細は下記リンクからご確認ください。`,
  improvements: [
    "導入部分の説得力が向上",
    "キーメッセージの明確化",
    "コール・トゥ・アクションの強化"
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'editing':
      return 'warning';
    case 'uploaded':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'editing':
      return '編集中';
    case 'uploaded':
      return 'アップロード済み';
    default:
      return status;
  }
};

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="light" 
            onClick={() => router.back()}
          >
            ← 戻る
          </Button>
          <h1 className="text-2xl font-bold">{scriptData.title}</h1>
          <Chip
            color={getStatusColor(scriptData.status)}
            variant="flat"
          >
            {getStatusText(scriptData.status)}
          </Chip>
        </div>
        <div className="flex gap-2">
          <Button color="primary">
            編集する
          </Button>
          <Button color="secondary">
            動画撮影
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardBody>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans">
                  {scriptData.content}
                </pre>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">AI改善ポイント</h2>
              <ul className="list-disc list-inside space-y-2">
                {scriptData.improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-600">
                    {improvement}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">台本情報</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">作成日:</span> {scriptData.createdAt}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">ID:</span> {params.id}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
