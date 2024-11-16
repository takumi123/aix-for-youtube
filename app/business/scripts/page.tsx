'use client';

import { Card, CardBody, Button, Chip, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Select, SelectItem } from "@nextui-org/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Script {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ScriptsPage() {
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // スクリプトデータの取得
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch('/api/scripts');
        if (!response.ok) {
          throw new Error('スクリプトの取得に失敗しました');
        }
        const data = await response.json();
        setScripts(data);
        setLoading(false);
      } catch (err) {
        console.error('スクリプト取得エラー:', err);
        setScripts([]); // エラー時は空配列を設定
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  const filteredScripts = scripts.filter(script => {
    if (filterStatus === "all") return true;
    if (filterStatus === "published") return script.status === "published";
    return script.status === "draft";
  });

  const handleCreateNew = () => {
    setEditingScript({
      id: '',
      title: '',
      content: '',
      status: 'draft',
      userId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onOpen();
  };

  const handleEdit = (script: Script) => {
    setEditingScript({ ...script });
    onOpen();
  };

  const handleSave = async () => {
    if (!editingScript) return;

    try {
      const method = editingScript.id ? 'PUT' : 'POST';
      const url = editingScript.id 
        ? `/api/scripts/${editingScript.id}`
        : '/api/scripts';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingScript.title,
          content: editingScript.content,
          status: editingScript.status,
        }),
      });

      if (!response.ok) {
        throw new Error(editingScript.id ? 'スクリプトの更新に失敗しました' : 'スクリプトの作成に失敗しました');
      }

      const savedScript = await response.json();
      
      if (editingScript.id) {
        setScripts(scripts.map(script => 
          script.id === savedScript.id ? savedScript : script
        ));
      } else {
        setScripts([savedScript, ...scripts]);
      }
      
      onClose();
    } catch (err) {
      console.error('スクリプト保存エラー:', err);
      // エラー処理を追加
    }
  };

  const handleDelete = async (scriptId: string) => {
    if (!confirm('このスクリプトを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('スクリプトの削除に失敗しました');
      }

      setScripts(scripts.filter(script => script.id !== scriptId));
    } catch (err) {
      console.error('スクリプト削除エラー:', err);
      // エラー処理を追加
    }
  };

  const handleStartRecording = (scriptId: string) => {
    router.push(`/business/dashboard?scriptId=${scriptId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'warning';
      case 'published':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'published':
        return '公開済み';
      default:
        return status;
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">台本一覧</h1>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">
                {filterStatus === "all" ? "すべて" : 
                 filterStatus === "published" ? "公開済み" : "下書き"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="フィルター"
              onAction={(key) => setFilterStatus(key as string)}
            >
              <DropdownItem key="all">すべて</DropdownItem>
              <DropdownItem key="published">公開済み</DropdownItem>
              <DropdownItem key="draft">下書き</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button 
          color="primary"
          onPress={handleCreateNew}
        >
          新規台本作成
        </Button>
      </div>

      {filteredScripts.length === 0 ? (
        <Card className="w-full">
          <CardBody className="text-center py-8">
            <p className="text-gray-500">台本がありません。新しい台本を作成してください。</p>
          </CardBody>
        </Card>
      ) : (
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
                      作成日: {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      更新日: {new Date(script.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {script.status === 'draft' && (
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
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(script.id)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingScript?.id ? '台本を編集' : '新規台本作成'}
              </ModalHeader>
              <ModalBody>
                {editingScript && (
                  <div className="space-y-4">
                    <Input
                      label="タイトル"
                      placeholder="タイトルを入力してください"
                      value={editingScript.title}
                      onChange={(e) => setEditingScript({
                        ...editingScript,
                        title: e.target.value
                      })}
                    />
                    <Textarea
                      label="台本内容"
                      placeholder="台本の内容を入力してください"
                      value={editingScript.content}
                      onChange={(e) => setEditingScript({
                        ...editingScript,
                        content: e.target.value
                      })}
                      minRows={10}
                    />
                    <Select
                      label="ステータス"
                      selectedKeys={[editingScript.status]}
                      onChange={(e) => setEditingScript({
                        ...editingScript,
                        status: e.target.value as 'draft' | 'published'
                      })}
                    >
                      <SelectItem key="draft" value="draft">下書き</SelectItem>
                      <SelectItem key="published" value="published">公開済み</SelectItem>
                    </Select>
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
