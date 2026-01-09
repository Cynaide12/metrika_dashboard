"use client";

import { getGuestsVisits, getVisitsByInterval } from "@/api/api";
import { CalendarDropdown } from "@/components/ui/calendar";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ru } from "date-fns/locale";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export const GuestsTable = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const handleChangeDate = (date: DateRange | undefined) => {
    setSelectedDateRange(date);
  };

  const visitsQuery = useQuery({
    queryKey: ["guests", selectedDateRange?.from, selectedDateRange?.to],
    //!когда нибудь уже наконец сделать создание и выбор домена
    queryFn: () => getGuestsVisits(1, selectedDateRange?.from?.toISOString(), selectedDateRange?.to?.toISOString())
  })

  useEffect(() => {
    console.log(selectedDateRange);
  }, [selectedDateRange]);

  return (
    <Card>
      <CardTitle>
        Посетители в период с {selectedDateRange?.from?.toLocaleDateString()} по{" "}
        {selectedDateRange?.to?.toLocaleDateString()}{" "}
      </CardTitle>
      <CalendarDropdown
        locale={ru}
        mode="range"
        selected={selectedDateRange}
        onSelect={handleChangeDate}
        required
        captionLayout="dropdown"
        className="rounded-md border shadow-sm"
      />
      <Table className="w-full">
        <TableHead>
          <TableCell>ID посетителя</TableCell>
          <TableCell>Первый визит</TableCell>
          <TableCell>Последний визит визит</TableCell>
          <TableCell>Всего визитов</TableCell>
          <TableCell>Общее время на сайте</TableCell>
        </TableHead>
        <TableBody>
          <TableRow></TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};
