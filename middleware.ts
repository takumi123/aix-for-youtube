import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // 管理画面へのアクセス（/business/以下のパス）
    if (path.startsWith('/business/')) {
      return NextResponse.next();
    }

    // 認証済みユーザーのルートページアクセス
    if (path === '/' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/business/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // /business/以下のパスは認証必須
        if (path.startsWith('/business/')) {
          return !!token;
        }
        // その他のパスは認証不要
        return true;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

// 保護するパスを指定
export const config = {
  matcher: [
    // 管理画面のパス
    '/business/:path*',
    // ルートページ
    '/'
  ]
};
