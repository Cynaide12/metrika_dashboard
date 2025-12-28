import { getVisitsByInterval } from "@/api/api";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { Bar, BarChart } from "recharts";

function VisitsByPeriodChart({
  from,
  to,
  timeInterval,
}: {
  from?: string;
  to?: string;
  timeInterval?: string;
}) {
  const visitsData = useQuery({
    queryKey: ["visits"],
    queryFn: () => getVisitsByInterval(1, "2024-01-27", "2026-01-28", 10, 10),
    staleTime: Infinity,
  });

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="max-h-1/6 max-w-full">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        <ChartLegend />
      </BarChart>
    </ChartContainer>
  );
}

export {
  VisitsByPeriodChart,
};
