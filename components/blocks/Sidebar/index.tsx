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
import { Map, SettingsIcon, Table, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface MenuItem {
  text: string;
  href: string;
  icon: FC;
}

const links: MenuItem[] = [
  { text: "Обзор", href: "/dashboard", icon: Table },
  { text: "Карта кликов", href: "/dashboard", icon: Map },
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
      <SidebarFooter>
        <ButtonGroup className="dark:invert">
          <Button >
            <User />
          </Button>
          <Button>
            <SettingsIcon />
          </Button>
        </ButtonGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
