'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";
import { signOut } from "next-auth/react";

interface HeaderProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export default function Header({ userName, userEmail, userImage }: HeaderProps) {
  return (
    <Navbar className="bg-white">
      <NavbarBrand>
        <Link href="/business/dashboard" className="font-bold text-black">
          AIx for Youtube
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <User
                name={userName}
                description={userEmail}
                avatarProps={{
                  src: userImage || "/default-avatar.png"
                }}
                className="cursor-pointer text-black"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="ユーザーアクション">
              <DropdownItem key="profile">プロフィール</DropdownItem>
              <DropdownItem key="settings">設定</DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger"
                onPress={() => signOut({ callbackUrl: '/auth/login' })}
              >
                ログアウト
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
