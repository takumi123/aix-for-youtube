'use client';

import { Card, CardBody, Button, Chip, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

interface Script {
  id: number;
  title: string;
  status: 'editing' | 'uploaded';
  createdAt: string;
  content: string;
  improvements: string[];
}

// Temporary mock data - replace with actual API call later
const initialScripts: Script[] = [
  {
    id: 1,
    title: "商品紹介動画 #1",
    status: "editing",
    createdAt: "2024-01-15",
    content: `# 動画台本\n\n## 導入部分\nこんにちは、[会社名]の[名前]です。\n今回は、弊社の新商品についてご紹介させていただきます。`,
    improvements: [
      "導入部分の説得力が向上",
      "キーメッセージの明確化",
      "コール・トゥ・アクションの強化"
    ]
  },
  {
    id: 2,
    title: "サービス説明動画",
    status: "uploaded",
    createdAt: "2024-01-14",
    content: `# サービス説明\n\n## 概要\n私たちのサービスは、お客様のビジネスに革新的なソリューションを提供します。`,
    improvements: [
      "ターゲット層への訴求ポイントを強化",
      "専門用語の平易な言い換え"
    ]
  }
];

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

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingScript, setEditingScript] = useState<Script | null>(null);

  const handleEdit = (script: Script) => {
    setEditingScript({ ...script });
    onOpen();
  };

  const handleSave = () => {
    if (!editingScript) return;

    setScripts(scripts.map(script => 
      script.id === editingScript.id ? editingScript : script
    ));
    onClose();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">台本一覧</h1>
        <Button 
          color="primary"
          as={Link}
          href="/business/scripts/new"
        >
          新規台本作成
        </Button>
      </div>

      <div className="space-y-4">
        {scripts.map((script) => (
          <Card key={script.id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <Link href={`/business/scripts/${script.id}`}>
                      <h2 className="text-xl font-semibold hover:text-blue-600">
                        {script.title}
                      </h2>
                    </Link>
                    <Chip
                      color={getStatusColor(script.status)}
                      variant="flat"
                    >
                      {getStatusText(script.status)}
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    作成日: {script.createdAt}
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-semibold mb-2">AI改善ポイント:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {script.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    color="primary" 
                    variant="light"
                    onPress={() => handleEdit(script)}
                  >
                    編集
                  </Button>
                  <Button 
                    as={Link} 
                    href={`/business/scripts/${script.id}`}
                    color="secondary"
                    variant="light"
                  >
                    詳細
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">台本を編集</ModalHeader>
              <ModalBody>
                {editingScript && (
                  <div className="space-y-4">
                    <Input
                      label="タイトル"
                      value={editingScript.title}
                      onChange={(e) => setEditingScript({
                        ...editingScript,
                        title: e.target.value
                      })}
                    />
                    <Textarea
                      label="台本内容"
                      value={editingScript.content}
                      onChange={(e) => setEditingScript({
                        ...editingScript,
                        content: e.target.value
                      })}
                      minRows={10}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button color="primary" onPress={handleSave}>
                  保存
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
