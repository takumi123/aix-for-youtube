'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';
import Header from '../../components/Header';
import Sidebar from '../../components/Business_Sidebar';
import Footer from '../../components/Footer';

export default function UploadPage() {
  const { } = useSession();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('22');
  const [privacyStatus, setPrivacyStatus] = useState('private');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!videoFile || !title || !description) {
      setMessage('すべての必須項目を入力してください');
      return;
    }

    setUploading(true);
    setMessage('アップロード中...');

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', categoryId);
      formData.append('privacyStatus', privacyStatus);
      
      // サムネイル画像がある場合は追加
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      
      const uploadResponse = await fetch('/api/youtube/upload', {
        method: 'POST',
        body: formData
      });

      const data = await uploadResponse.json();

      if (data.success) {
        setMessage(`動画のアップロードが完了しました。動画ID: ${data.videoId}`);
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      setMessage('アップロードに失敗しました');
      console.error('アップロードエラー:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <Card className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">動画アップロード</h1>
            
            <div className="space-y-4">
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                label="動画ファイルを選択"
              />

              <Input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                label="サムネイル画像を選択（JPEGまたはPNG）"
              />

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                label="タイトル"
                placeholder="動画のタイトルを入力"
              />

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="説明"
                placeholder="動画の説明を入力"
              />

              <Select
                label="カテゴリ"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <SelectItem key="22" value="22">一般</SelectItem>
                <SelectItem key="23" value="23">コメディ</SelectItem>
                <SelectItem key="27" value="27">教育</SelectItem>
              </Select>

              <Select
                label="公開設定"
                value={privacyStatus}
                onChange={(e) => setPrivacyStatus(e.target.value)}
              >
                <SelectItem key="private" value="private">非公開</SelectItem>
                <SelectItem key="public" value="public">公開</SelectItem>
                <SelectItem key="unlisted" value="unlisted">限定公開</SelectItem>
              </Select>

              <Button
                color="primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'アップロード中...' : 'アップロード'}
              </Button>

              {message && (
                <p className="text-center mt-4">
                  {message}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
