"use client";

import { getGuestsVisits } from "@/api/api";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bar, BarChart, Line, LineChart } from "recharts";

function ButtonBar() {
  const [selected, setSelected] = useState(0);
  const options = [
    {
      startDate: "",
      endDate: "",
      title: "Сегодня",
    },
    {
      startDate: "",
      endDate: "",
      title: "Вчера",
    },
    {
      startDate: "",
      endDate: "",
      title: "Неделя",
    },
    {
      startDate: "",
      endDate: "",
      title: "Месяц",
    },
    {
      startDate: "",
      endDate: "",
      title: "Квартал",
    },
  ];

  const handleClick = (index: number) => {
    setSelected(index);
  };

  return (
    <Card>
      <CardContent>
        <ButtonGroup>
          {options.map((option, index) => (
            <Button
              key={index}
              className={index === selected ? "dark" : ""}
              onClick={() => handleClick(index)}
            >
              {option.title}
            </Button>
          ))}
        </ButtonGroup>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const visitsData = useQuery({
    queryKey: ["visits"],
    queryFn: () => getGuestsVisits(1),
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

  if (visitsData.isError) throw visitsData.error;

  if (visitsData.isLoading) return <Skeleton className="h-screen" />;

  return (
    <div>
      <ButtonBar />
      <ChartContainer config={chartConfig} className="max-h-1/6 max-w-full">
        <LineChart accessibilityLayer data={chartData}>
          <Line dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Line dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          <ChartLegend></ChartLegend>
        </LineChart>
      </ChartContainer>
    </div>
  );
}
