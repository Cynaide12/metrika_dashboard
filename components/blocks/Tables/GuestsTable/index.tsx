"use client";

import { getGuests, getGuestsVisits, getVisitsByInterval } from "@/api/api";
import { CalendarDropdown } from "@/components/ui/calendar";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
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

  const guestsQuery = useQuery({
    queryKey: ["guests", selectedDateRange?.from, selectedDateRange?.to],
    //!когда нибудь уже наконец сделать создание и выбор домена
    queryFn: () => getGuests(1),
  });

  useEffect(() => {
    console.log(selectedDateRange);
  }, [guestsQuery.data]);

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
      <Table className="w-full h-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID посетителя</TableHead>
            <TableHead>Первый визит</TableHead>
            <TableHead>Последний визит</TableHead>
            <TableHead>Всего визитов</TableHead>
            <TableHead>Общее время на сайте</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guestsQuery.isLoading && <TableRow />}
          {guestsQuery.data &&
            !guestsQuery.isLoading &&
            guestsQuery.data?.guests?.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.id}</TableCell>
                <TableCell>
                  {new Date(guest.first_visit || "-").toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(guest.last_visit || "-").toLocaleDateString()}
                </TableCell>
                <TableCell>{guest.sessions_count}</TableCell>
                <TableCell>позже сделаю</TableCell>
                <TableCell className={cn(guest.is_online && "text-green-500")}>
                  {guest.is_online ? "Сейчас на сайте" : "Не в сети"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};
