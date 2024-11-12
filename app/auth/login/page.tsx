'use client';

import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image'
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">ログイン</h1>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/business/dashboard' })}
          className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg mb-4 hover:bg-gray-50 flex items-center justify-center"
        >
          <Image 
            src="/google-icon.svg" 
            alt="Google" 
            width={24} 
            height={24} 
            className="mr-2"
          />
          Googleでログイン
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          ログアウト
        </button>

        <div className="mt-4 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">セッション情報</h2>
          {session ? (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">名前:</span> {session.user?.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">メール:</span> {session.user?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">ステータス:</span> ログイン中
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              ログインしていません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
