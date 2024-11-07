'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" className="font-bold text-inherit">
          15分動画作成
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/dashboard" color="foreground">
            動画撮影
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/videos" color="foreground">
            過去動画一覧
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/analytics" color="foreground">
            分析
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/next-actions" color="foreground">
            ネクストアクション
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/form-settings" color="foreground">
            フォーム設定
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/settings" color="foreground">
            設定
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/dashboard" variant="flat">
            撮影を始める
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
