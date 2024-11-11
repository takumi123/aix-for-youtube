'use client';

import { useState } from 'react';
import { NextUIProvider } from "@nextui-org/react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Business_Sidebar";
import Footer from "@/app/components/Footer";


export default function Knowledge() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/business_data/knowledge_upload', {
        method: 'POST',
        body: file
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      setUploadedFileUrl(data.url);

    } catch (error) {
      console.error('アップロードエラー:', error);
    }
  };

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-white text-black">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="space-y-8">
              {/* ナレッジベースセクション */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-black">ナレッジ</h2>
                <div className="flex">
                  {/* サイドバー */}
                  <div className="w-64 border-r pr-4">
                    <div className="mb-4">
                      <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        + 新規セクション
                      </button>
                    </div>
                    <nav className="space-y-2">
                      <div>
                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold">
                          集客
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            目的
                          </div>
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            ターゲット
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold">
                          商品・サービス
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            商品概要
                          </div>
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            価格設定
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold">
                          マーケティング
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            戦略
                          </div>
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            施策
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold">
                          競合分析
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            主要競合
                          </div>
                          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm">
                            差別化ポイント
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* メインコンテンツエリア */}
                  <div className="flex-1 pl-6">
                    <div className="mb-4 flex justify-between items-center">
                      <input
                        type="text"
                        className="text-xl font-semibold w-full border-b border-transparent focus:border-gray-300 focus:outline-none"
                        defaultValue="集客 > 目的"
                      />
                      <button className="text-blue-500 hover:text-blue-700">
                        編集
                      </button>
                    </div>
                    <div className="prose max-w-none">
                      <textarea
                        className="w-full h-[400px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ここにコンテンツを入力してください..."
                      ></textarea>
                    </div>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                        AIで生成
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* アップロードセクション */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-black">ドキュメントアップロード</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-black">
                        <span className="font-semibold">クリックしてアップロード</span> または ドラッグ＆ドロップ
                      </p>
                      <p className="text-xs text-black">PDF, DOCX, TXT (最大 10MB)</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                {uploadedFileUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">アップロードされたファイル:</p>
                    <a 
                      href={uploadedFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {uploadedFileUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ドキュメント一覧セクション */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4 text-black">アップロード済みドキュメント</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* ドキュメントカード */}
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-black">サンプルドキュメント.pdf</h3>
                      <p className="text-sm text-black">2024/01/01 アップロード</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      ダウンロード
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Footer />
        </div>
      </div>
    </NextUIProvider>
  );
}
