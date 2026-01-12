"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ThemeContext } from "@/providers/ThemeProvider";
import {
  Map,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  Table,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { FC, useContext } from "react";

interface MenuItem {
  text: string;
  href: string;
  icon: FC;
}

const links: MenuItem[] = [
  { text: "Обзор", href: "/dashboard", icon: Table },
  { text: "Карта кликов", href: "/dashboard", icon: Map },
  { text: "Посетители", href: "/dashboard/guests", icon: Users },
];
const MenuItem = ({ item }: { item: MenuItem }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <Link href={item.href} className="flex flex-row items-center gap-2">
          <item.icon />
          <span className="text-xl">{item.text}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton className="flex justify-center items-center h-15">
          <Link href="/dashboard">
            <Image
              className="dark:invert"
              src="/logo.svg"
              alt="Next.js logo"
              width={230}
              height={20}
              priority
            />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link, i) => (
                <MenuItem item={link} key={i} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-row justify-between gap-2">
        <ButtonGroup className="invert w-fit">
          <Button className="cursor-pointer hover:invert">
            <User />
          </Button>
          <Button className="cursor-pointer hover:invert">
            <SettingsIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="invert w-fit">
          <Button
            value="dark"
            onClick={() => setTheme("dark")}
            className={cn(
              "cursor-pointer transition-colors bg-primary",
              "hover:invert",
              theme == "dark" && "invert"
            )}
          >
            <MoonIcon />
          </Button>
          <Button
            value="light"
            onClick={() => setTheme("light")}
            className={cn(
              "cursor-pointer transition-colors bg-primary",
              "hover:invert",
              theme == "light" && "invert"
            )}
          >
            <SunIcon />
          </Button>
        </ButtonGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
