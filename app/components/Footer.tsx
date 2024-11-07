'use client';

import { Link } from "@nextui-org/react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">15分動画作成</h3>
            <p className="text-sm text-gray-600">
              小規模事業者・個人事業主向けの<br />
              動画マーケティング支援サービス
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">メイン機能</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">動画撮影</Link></li>
              <li><Link href="/videos" className="text-sm text-gray-600 hover:text-gray-900">過去動画一覧</Link></li>
              <li><Link href="/analytics" className="text-sm text-gray-600 hover:text-gray-900">分析</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">設定</h4>
            <ul className="space-y-2">
              <li><Link href="/next-actions" className="text-sm text-gray-600 hover:text-gray-900">ネクストアクション</Link></li>
              <li><Link href="/form-settings" className="text-sm text-gray-600 hover:text-gray-900">フォーム設定</Link></li>
              <li><Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">各種設定</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">アカウント</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">プロフィール編集</Link></li>
              <li><Link href="/account" className="text-sm text-gray-600 hover:text-gray-900">アカウント設定</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} 15分動画作成. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
