"use client";

import { getVisitsByInterval } from "@/api/api";
import { VisitsByPeriodChart } from "@/components/blocks/Charts/VisitsByPeriodChart";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page-container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getDateDays, getDateMonth } from "@/lib/utils";
import { SelectLabel } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const timeIntervalsDays = [
  { title: "по минутам", value: "1" },
  { title: "по 10 минут", value: "10" },
  { title: "по часам", value: "60" },
];

const timeIntervalWeeks = [
  { title: "по часам", value: "60" },
  { title: "по дням", value: `${60 * 24}` },
];

const timeIntervalMonths = [
  { title: "по дням", value: `${60 * 24}` },
  { title: "по неделям", value: `${60 * 24 * 7}` },
];

const dateRanges = [
  {
    startDate: getDateDays(),
    endDate: getDateDays(1),
    title: "Сегодня",
    intervals: timeIntervalsDays,
  },
  {
    startDate: getDateDays(-1),
    endDate: getDateDays(),
    title: "Вчера",
    intervals: timeIntervalsDays,
  },
  {
    startDate: getDateDays(-7),
    endDate: getDateDays(),
    title: "Неделя",
    intervals: timeIntervalWeeks,
  },
  {
    startDate: getDateMonth(-1),
    endDate: getDateMonth(),
    title: "Месяц",
    intervals: timeIntervalWeeks,
  },
  {
    startDate: getDateMonth(-4),
    endDate: getDateMonth(),
    title: "Квартал",
    intervals: timeIntervalMonths,
  },
];

function ButtonBar({
  selectedDateRange,
  selectedTimeInterval,
  onChangeDateRange,
  onChangeTimeInterval,
}: {
  selectedDateRange: number;
  selectedTimeInterval: number;
  onChangeDateRange: (i: number) => void;
  onChangeTimeInterval: (val: number) => void;
}) {
  const handleChangeDateRange = (index: number) => {
    onChangeDateRange(index);
    onChangeTimeInterval(+dateRanges[index].intervals[0].value);
  };
  return (
    <Card>
      <CardContent className="flex gap-2">
        <ButtonGroup>
          {dateRanges.map((option, index) => (
            <Button
              key={index}
              className={index === selectedDateRange ? "dark" : ""}
              onClick={() => handleChangeDateRange(index)}
            >
              {option.title}
            </Button>
          ))}
        </ButtonGroup>
        <Select
          value={String(selectedTimeInterval)}
          onValueChange={(val) => onChangeTimeInterval(+val)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectGroup>
            <SelectContent>
              <SelectLabel>Период</SelectLabel>
              {dateRanges[selectedDateRange].intervals.map((option) => (
                <SelectItem key={option.title} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </Select>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [selectedDateRange, setSelectedDateRange] = useState(0);
  const [selectedTimeInterval, setSelectedTimeInterval] = useState(10);

  const visitsData = useQuery({
    queryKey: ["visits", selectedDateRange, selectedTimeInterval],
    queryFn: () =>
      getVisitsByInterval(
        1,
        dateRanges[selectedDateRange].startDate,
        dateRanges[selectedDateRange].endDate,
        selectedTimeInterval,
        selectedTimeInterval
      ),
    staleTime: Infinity,
  });

  useEffect(() => {
    console.log(selectedTimeInterval);
  }, [selectedTimeInterval]);

  if (visitsData.isError) throw visitsData.error;

  if (visitsData.isLoading || !visitsData.data)
    return <Skeleton className="h-screen" />;

  return (
    <PageContainer>
      <ButtonBar
        selectedDateRange={selectedDateRange}
        selectedTimeInterval={selectedTimeInterval}
        onChangeDateRange={setSelectedDateRange}
        onChangeTimeInterval={setSelectedTimeInterval}
      />
      {/* {visitsData.data?.sessions.length} */}
      <VisitsByPeriodChart data={visitsData.data.sessions} />
    </PageContainer>
  );
}
