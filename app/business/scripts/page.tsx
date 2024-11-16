'use client';

import { Card, CardBody, Button, Chip, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Script {
  id: number;
  title: string;
  status: 'editing' | 'uploaded' | 'recorded';
  createdAt: string;
  content: string;
  improvements: string[];
  videoId?: string;
  tags: string[];
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
    ],
    tags: ["商品紹介", "新製品"]
  },
  {
    id: 2,
    title: "サービス説明動画",
    status: "recorded",
    createdAt: "2024-01-14",
    content: `# サービス説明\n\n## 概要\n私たちのサービスは、お客様のビジネスに革新的なソリューションを提供します。`,
    improvements: [
      "ターゲット層への訴求ポイントを強化",
      "専門用語の平易な言い換え"
    ],
    videoId: "1",
    tags: ["サービス", "説明"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'editing':
      return 'warning';
    case 'uploaded':
      return 'success';
    case 'recorded':
      return 'primary';
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
    case 'recorded':
      return '撮影済み';
    default:
      return status;
  }
};

export default function ScriptsPage() {
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTag, setNewTag] = useState("");

  const filteredScripts = scripts.filter(script => {
    if (filterStatus === "all") return true;
    if (filterStatus === "recorded") return script.status === "recorded";
    return script.status !== "recorded";
  });

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

  const handleAddTag = () => {
    if (!editingScript || !newTag.trim()) return;
    
    if (!editingScript.tags.includes(newTag.trim())) {
      setEditingScript({
        ...editingScript,
        tags: [...editingScript.tags, newTag.trim()]
      });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingScript) return;
    
    setEditingScript({
      ...editingScript,
      tags: editingScript.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleStartRecording = (scriptId: number) => {
    router.push(`/business/dashboard?scriptId=${scriptId}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">台本一覧</h1>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                {filterStatus === "all" ? "すべて" : 
                 filterStatus === "recorded" ? "撮影済み" : "未撮影"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="フィルター"
              onAction={(key) => setFilterStatus(key as string)}
            >
              <DropdownItem key="all">すべて</DropdownItem>
              <DropdownItem key="recorded">撮影済み</DropdownItem>
              <DropdownItem key="not_recorded">未撮影</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button 
          color="primary"
          as={Link}
          href="/business/scripts/new"
        >
          新規台本作成
        </Button>
      </div>

      <div className="space-y-4">
        {filteredScripts.map((script) => (
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
                  <div className="flex gap-2 mt-2">
                    {script.tags.map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>
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
                  {script.status !== 'recorded' && (
                    <Button 
                      color="success"
                      onPress={() => handleStartRecording(script.id)}
                    >
                      撮影開始
                    </Button>
                  )}
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
                    <div>
                      <p className="text-sm font-semibold mb-2">タグ:</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingScript.tags.map((tag, index) => (
                          <Chip 
                            key={index}
                            onClose={() => handleRemoveTag(tag)}
                            variant="flat"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="新しいタグを追加"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button onClick={handleAddTag}>追加</Button>
                      </div>
                    </div>
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
