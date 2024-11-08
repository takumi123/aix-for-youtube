'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar className="text-black">
      <NavbarBrand>
        <Link href="/" className="font-bold text-black">
          AIx for Youtube
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <User
                name="ユーザー名"
                description="user@example.com"
                avatarProps={{
                  src: "https://example.com/avatar.jpg"
                }}
                className="cursor-pointer text-black"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="ユーザーアクション" className="text-black">
              <DropdownItem key="profile" className="text-black">プロフィール</DropdownItem>
              <DropdownItem key="settings" className="text-black">設定</DropdownItem>
              <DropdownItem key="logout" color="danger" className="text-black">
                ログアウト
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
