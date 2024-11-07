'use client';

import { Link } from "@nextui-org/react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <nav className="space-y-2">
        <Link 
          href="/dashboard" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          動画撮影
        </Link>
        <Link 
          href="/videos" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          過去動画一覧
        </Link>
        <Link 
          href="/analytics" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          分析
        </Link>
        <Link 
          href="/next-actions" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          ネクストアクション
        </Link>
        <Link 
          href="/form-settings" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          フォーム設定
        </Link>
        <Link 
          href="/settings" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          設定
        </Link>
      </nav>
    </div>
  );
}
