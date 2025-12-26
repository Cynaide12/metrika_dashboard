"use client";

import { getGuestsVisits } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const visitsData = useQuery({
    queryKey: ["visits"],
    queryFn: () => getGuestsVisits(1),
  });

  if (visitsData.isError) throw visitsData.error;

  if (visitsData.isLoading) return <Skeleton></Skeleton>;

  return <h1>наъуй иди</h1>;
}
