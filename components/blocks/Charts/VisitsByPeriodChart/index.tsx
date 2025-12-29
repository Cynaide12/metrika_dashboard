"use client";

import { GuestSessionByTimeBucket } from "@/api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

function VisitsByPeriodChart({ data }: { data: GuestSessionByTimeBucket[] }) {
  console.log(data);

  const chartConfig = {
    visits: {
      label: "Посещений",
      color: "var(--chart-2)",
    },
    uniques: {
      label: "Уникальных",
      color: "var(--chart-1)",
    },
    nullable: {
      label: "nullable",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const total = useMemo(
    () => ({
      visits: data.reduce((acc, curr) => acc + curr.visits, 0),
      uniques: data.reduce((acc, curr) => acc + curr.uniques, 0),
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b">
        <CardTitle>Количество посещений за последние сутки</CardTitle>
        <div className="flex justify-start">
          {["visits", "uniques"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={key}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <Bar dataKey={"visits"} fill={`var(--color-visits)`} />
            <Bar dataKey={"uniques"} fill={`var(--color-uniques)`} />
            <Bar
              dataKey={"nullable"}
              fill={`var(--color-nullable)`}
              values="1000"
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time_bucket"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={5}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ru-RU", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZone: "Etc/GMT-5",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      timeZone: "Etc/GMT-5",
                    });
                  }}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { VisitsByPeriodChart };
