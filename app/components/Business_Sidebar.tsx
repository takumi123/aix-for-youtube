'use client';

import { Link } from "@nextui-org/react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <nav className="space-y-2">
        <Link 
          href="/business/dashboard" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          動画撮影
        </Link>
        <Link 
          href="/business/movies" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          過去動画一覧
        </Link>
        <Link 
          href="/business/scripts" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          台本一覧
        </Link>
        <Link 
          href="/business/knowledge" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          ナレッジベース
        </Link>
        <Link 
          href="/business/setting" 
          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          設定
        </Link>
      </nav>
    </div>
  );
}
