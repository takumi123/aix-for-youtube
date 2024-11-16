'use client';

import { Card, CardBody, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, Textarea } from "@nextui-org/react";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useDropzone } from 'react-dropzone';

interface Knowledge {
  id: string;
  title: string;
  content: string;
  category: string | null;
  subCategory: string | null;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  files: string[];
}

interface KnowledgeUploadResponse {
  fileUrls: string[];
  category?: string;
  subCategory?: string;
  tags: string[];
}

export default function KnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    },
    multiple: true
  });

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const response = await fetch('/api/knowledge');
        if (!response.ok) {
          throw new Error('ナレッジの取得に失敗しました');
        }
        const data: Knowledge[] = await response.json();
        setKnowledgeList(data);
      } catch (err) {
        console.error('ナレッジ取得エラー:', err);
        setKnowledgeList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  const handleUploadFiles = async () => {
    if (!uploadedFiles.length) return;

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/business_data/knowledge_upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('ファイルのアップロードに失敗しました');
      }

      const data: KnowledgeUploadResponse = await response.json();

      if (editingKnowledge) {
        setEditingKnowledge({
          ...editingKnowledge,
          files: [...(editingKnowledge.files || []), ...data.fileUrls],
          category: data.category || editingKnowledge.category,
          subCategory: data.subCategory || editingKnowledge.subCategory,
          tags: [...new Set([...(editingKnowledge.tags || []), ...data.tags])]
        });
      }

      setUploadedFiles([]);
    } catch (err) {
      console.error('ファイルアップロードエラー:', err);
      alert(err instanceof Error ? err.message : 'ファイルのアップロードに失敗しました');
    }
  };

  const handleEdit = (knowledge: Knowledge) => {
    setEditingKnowledge({ ...knowledge });
    onOpen();
  };

  const handleSave = async () => {
    if (!editingKnowledge) return;

    try {
      const method = editingKnowledge.id ? 'PUT' : 'POST';
      const url = editingKnowledge.id
        ? `/api/knowledge/${editingKnowledge.id}`
        : '/api/knowledge';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingKnowledge),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || 'ナレッジの保存に失敗しました';

        throw new Error(errorMessage);
      }

      const savedKnowledge: Knowledge = await response.json();

      if (editingKnowledge.id) {
        setKnowledgeList(knowledgeList.map((knowledge) =>
          knowledge.id === savedKnowledge.id ? savedKnowledge : knowledge
        ));
      } else {
        setKnowledgeList([savedKnowledge, ...knowledgeList]);
      }

      onClose();
    } catch (err: unknown) {
      console.error('ナレッジ保存エラー:', err);
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleCreateScript = async (knowledgeId: string) => {
    try {
      const response = await fetch(`/api/scripts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          knowledgeId,
        }),
      });

      if (!response.ok) {
        throw new Error('台本の作成に失敗しました');
      }

      const script: { id: string } = await response.json();
      window.location.href = `/business/scripts/${script.id}`;
    } catch (err) {
      console.error('台本作成エラー:', err);
      alert(err instanceof Error ? err.message : '台本の作成に失敗しました');
    }
  };

  const handleDelete = async (knowledgeId: string) => {
    if (!confirm('このナレッジを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/knowledge/${knowledgeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('ナレッジの削除に失敗しました');
      }

      setKnowledgeList(knowledgeList.filter((knowledge) => knowledge.id !== knowledgeId));
    } catch (err) {
      console.error('ナレッジ削除エラー:', err);
      alert(err instanceof Error ? err.message : 'ナレッジの削除に失敗しました');
    }
  };

  const handleAddTag = () => {
    if (!editingKnowledge || !newTag.trim()) return;

    const trimmedTag = newTag.trim();
    if (!editingKnowledge.tags.includes(trimmedTag)) {
      setEditingKnowledge({
        ...editingKnowledge,
        tags: [...editingKnowledge.tags, trimmedTag],
      });
    }

    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingKnowledge) return;

    setEditingKnowledge({
      ...editingKnowledge,
      tags: editingKnowledge.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCreateNew = () => {
    setEditingKnowledge({
      id: '',
      title: '',
      content: '',
      category: null,
      subCategory: null,
      tags: [],
      files: [],
      userId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onOpen();
  };

  const handleInputChange = (field: keyof Knowledge) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingKnowledge) {
      setEditingKnowledge({
        ...editingKnowledge,
        [field]: e.target.value,
      });
    }
  };

  const handleTagKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ナレッジ管理</h1>
        <Button
          color="primary"
          onPress={handleCreateNew}
        >
          新規作成
        </Button>
      </div>

      {knowledgeList.length === 0 ? (
        <Card className="w-full">
          <CardBody className="text-center py-8">
            <p className="text-gray-500">ナレッジがありません。新しいナレッジを作成してください。</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeList.map((knowledge) => (
            <Card key={knowledge.id} className="w-full">
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">{knowledge.title}</h2>
                    <p className="text-sm text-gray-500">
                      カテゴリー: {knowledge.category || '未分類'}
                      {knowledge.subCategory && ` > ${knowledge.subCategory}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {knowledge.tags.map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 line-clamp-3">
                    {knowledge.content}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      更新日: {new Date(knowledge.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="light"
                        onPress={() => handleEdit(knowledge)}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        color="success"
                        variant="light"
                        onPress={() => handleCreateScript(knowledge.id)}
                      >
                        台本作成
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => handleDelete(knowledge.id)}
                      >
                        削除
                      </Button>
                    </div>
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
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editingKnowledge?.id ? 'ナレッジを編集' : '新規ナレッジ作成'}
              </ModalHeader>
              <ModalBody>
                {editingKnowledge && (
                  <div className="space-y-4">
                    <Input
                      label="タイトル"
                      value={editingKnowledge.title}
                      onChange={handleInputChange('title')}
                    />
                    <Input
                      label="カテゴリー"
                      value={editingKnowledge.category || ''}
                      onChange={handleInputChange('category')}
                    />
                    <Input
                      label="サブカテゴリー"
                      value={editingKnowledge.subCategory || ''}
                      onChange={handleInputChange('subCategory')}
                    />
                    <Textarea
                      label="内容"
                      value={editingKnowledge.content}
                      onChange={handleInputChange('content')}
                      minRows={10}
                    />
                    <div>
                      <p className="text-sm font-semibold mb-2">タグ:</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingKnowledge.tags.map((tag, index) => (
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
                          onKeyPress={handleTagKeyPress}
                        />
                        <Button onClick={handleAddTag}>追加</Button>
                      </div>
                    </div>
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
                    >
                      <input {...getInputProps()} />
                      <p>ファイルをドラッグ＆ドロップするか、クリックして選択してください</p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2">アップロード待ちファイル:</p>
                        <ul className="list-disc pl-5">
                          {uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                        <Button
                          color="primary"
                          className="mt-2"
                          onClick={handleUploadFiles}
                        >
                          ファイルをアップロード
                        </Button>
                      </div>
                    )}
                    {editingKnowledge.files && editingKnowledge.files.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2">アップロード済みファイル:</p>
                        <ul className="list-disc pl-5">
                          {editingKnowledge.files.map((file, index) => (
                            <li key={index}>{file}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
