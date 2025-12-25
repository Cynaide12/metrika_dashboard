import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Table } from "lucide-react";
import { ReactNode } from "react";

interface MenuItem {
  text: string;
  href: string;
  link?: ReactNode;
}

const links: MenuItem[] = [
  { text: "Обзор", href: "/", link: <Table /> },
  { text: "Обзор", href: "/", link: <Table /> },
];
const MenuItem = ({ item }: { item: MenuItem }) => {
  return (
    <SidebarMenuItem>
      <NavigationMenuLink href={item.href} className="flex-row items-center">
        <Badge>{item.link}</Badge> <span className="text-xl">{item.text}</span>
      </NavigationMenuLink>
    </SidebarMenuItem>
  );
};

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <NavigationMenu className="w-full flex flex-col max-w-full">
            {links.map((link, i) => (
              <MenuItem item={link} key={i} />
            ))}
          </NavigationMenu>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
