"use client";

import { GuestsTable } from "@/components/blocks/Tables/GuestsTable";
import { PageContainer } from "@/components/ui/page-container";

export default function GuestsPage() {
  return (
    <PageContainer className="pt-0">
      <GuestsTable />
    </PageContainer>
  );
}
