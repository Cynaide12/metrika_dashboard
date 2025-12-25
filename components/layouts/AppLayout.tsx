import { FC, PropsWithChildren } from "react";
import { AppSidebar } from "../blocks/Sidebar";
import { SidebarProvider } from "../ui/sidebar";

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
};
