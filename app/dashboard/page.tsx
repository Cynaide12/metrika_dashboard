"use client";

import { getGuestsVisits, getVisitsByInterval } from "@/api/api";
import { VisitsByPeriodChart } from "@/components/blocks/Charts/VisitsByPeriodChart";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectLabel } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Bar, BarChart } from "recharts";

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
      <CardContent className="flex gap-2">
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
        <Select defaultValue="10minutes">
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectGroup>
            <SelectContent>
              <SelectLabel>Период</SelectLabel>
              <SelectItem value="10minutes">по 10 минут</SelectItem>
              <SelectItem value="hours">по часам</SelectItem>
            </SelectContent>
          </SelectGroup>
        </Select>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const visitsData = useQuery({
    queryKey: ["visits"],
    queryFn: () => getVisitsByInterval(1, "2014-11-12T11:45:26.371Z", "2026-11-12T11:45:26.371Z", 10, 10),
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

  useEffect(() => {
    console.log(visitsData.data?.sessions);
  }, [visitsData.data?.sessions]);

  if (visitsData.isError) throw visitsData.error;

  if (visitsData.isLoading || !visitsData.data)
    return <Skeleton className="h-screen" />;

  // console.log(visitsData.data.sessions)

  return (
    <div>
      <ButtonBar />
      {/* {visitsData.data?.sessions.length} */}
      <VisitsByPeriodChart />
    </div>
  );
}
