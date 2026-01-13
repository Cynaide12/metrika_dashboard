import { AppLayout } from "@/components/layouts/AppLayout";
import { PageContainer } from "@/components/ui/page-container";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AppLayout>{children}</AppLayout>;
}
