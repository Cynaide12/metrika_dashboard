import { FC, PropsWithChildren } from "react";
import { AppSidebar } from "../blocks/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div>
        <SidebarTrigger className="absolute z-10" />
      </div>
      {children}
    </SidebarProvider>
  );
};
