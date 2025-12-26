import { AppLayout } from "@/components/layouts/AppLayout";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AppLayout>{children}</AppLayout>;
}
