import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Table } from "lucide-react";
import Link from "next/link";
import { FC, JSX, ReactNode } from "react";

interface MenuItem {
  text: string;
  href: string;
  icon: FC;
}

const links: MenuItem[] = [
  { text: "Обзор", href: "/", icon: Table },
  { text: "Обзор", href: "/", icon: Table },
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
      <SidebarContent>
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
    </Sidebar>
  );
};
