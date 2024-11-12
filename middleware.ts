export { default } from "next-auth/middleware"

// 保護したいページのパスを指定
export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*"
  ]
} 