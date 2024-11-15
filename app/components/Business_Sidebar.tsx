'use client';

import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <nav className="space-y-2">
        <Link 
          href="/business/dashboard" 
          className={`block px-4 py-2 rounded ${
            pathname === '/business/dashboard'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          動画撮影
        </Link>
        <Link 
          href="/business/movies" 
          className={`block px-4 py-2 rounded ${
            pathname === '/business/movies'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          過去動画一覧
        </Link>
        <Link 
          href="/business/scripts" 
          className={`block px-4 py-2 rounded ${
            pathname === '/business/scripts'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          台本一覧
        </Link>
        <Link 
          href="/business/knowledge" 
          className={`block px-4 py-2 rounded ${
            pathname === '/business/knowledge'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          ナレッジベース
        </Link>
        <Link 
          href="/business/setting" 
          className={`block px-4 py-2 rounded ${
            pathname === '/business/setting'
              ? 'bg-blue-500 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          設定
        </Link>
      </nav>
    </div>
  );
}
