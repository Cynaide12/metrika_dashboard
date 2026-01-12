"use client";

import { getGuests } from "@/api/api";
import { Button } from "@/components/ui/button";
import { CalendarDropdown } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ru } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Footer = ({
  onChangeRowsPerPage,
  rowsPerPage,
  total,
  offset,
  handleNextPage,
  handlePrevPage,
}: {
  onChangeRowsPerPage: (val: number) => void;
  rowsPerPage: number;
  total: number;
  offset: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}) => {
  const [openRowsPerPage, setOpenRowsPerPage] = useState(false);

  return (
    <TableFooter className="sticky bottom-0 bg-muted">
      <TableRow>
        <TableCell colSpan={6} className="py-3">
          <div className="w-full flex justify-end items-center gap-3">
            <div>
              {rowsPerPage + offset > total ? total : rowsPerPage + offset} из{" "}
              {total}
            </div>
            <DropdownMenu
              open={openRowsPerPage}
              onOpenChange={setOpenRowsPerPage}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-60 justify-between font-normal"
                >
                  Количество строк на странице
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                {[10, 25, 50, 100].map((val) => (
                  <DropdownMenuItem
                    onClick={() => onChangeRowsPerPage(val)}
                    className={cn(rowsPerPage == val && "bg-muted/50")}
                    key={val}
                  >
                    {val}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Pagination className="w-fit mx-0">
              <PaginationContent>
                <PaginationPrevious
                  isActive
                  className="cursor-pointer transition-colors"
                  hiddenText
                  onClick={handlePrevPage}
                />
                <PaginationNext
                  isActive
                  className="cursor-pointer transition-colors"
                  hiddenText
                  onClick={handleNextPage}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export const GuestsTable = () => {
  const router = useRouter();

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [offset, setOffset] = useState(0);

  const handleChangeDate = (date: DateRange | undefined) => {
    setSelectedDateRange(date);
  };

  const guestsQuery = useQuery({
    queryKey: [
      "guests",
      selectedDateRange?.from,
      selectedDateRange?.to,
      offset,
      rowsPerPage,
    ],
    //!когда нибудь уже наконец сделать создание и выбор домена
    queryFn: () =>
      getGuests(2, {
        start_date: selectedDateRange?.from?.toISOString(),
        end_date: selectedDateRange?.to?.toISOString(),
        offset: offset,
        limit: rowsPerPage,
      }),
  });

  const handleNextPage = () => {
    if (offset + rowsPerPage >= (guestsQuery.data?.total || 0)) return;
    setOffset((prev) => prev + rowsPerPage);
  };
  const handlePrevPage = () => {
    if (offset - rowsPerPage <= 0) {
      setOffset(0);
    } else {
      setOffset((prev) => prev - rowsPerPage);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Посетители</CardTitle>
        <div className="w-full flex">
          <div className="flex flex-col gap-1">
            <Label>Период</Label>
            <CalendarDropdown
              locale={ru}
              mode="range"
              selected={selectedDateRange}
              onSelect={handleChangeDate}
              required
              captionLayout="dropdown"
              className="rounded-md border shadow-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table
          className="relative"
          containerClassname=" *:data-[slot=table-container]:overflow-y-auto rounded-md border"
        >
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead className="py-5">ID посетителя</TableHead>
              <TableHead>Первый визит</TableHead>
              <TableHead>Последний визит</TableHead>
              <TableHead>Всего визитов</TableHead>
              <TableHead>Общее время на сайте</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guestsQuery.isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="p-0" rowSpan={10}>
                  <Skeleton className="h-[60vh] w-full" />
                </TableCell>
              </TableRow>
            )}
            {guestsQuery.data &&
              !guestsQuery.isLoading &&
              guestsQuery.data?.guests?.map((guest) => (
                <TableRow
                  key={guest.id}
                  onClick={() => router.push(`/dashboard/guests/${guest.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>{guest.id}</TableCell>
                  <TableCell>
                    {new Date(guest.first_visit || "-").toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(guest.last_visit || "-").toLocaleDateString()}
                  </TableCell>
                  <TableCell>{guest.sessions_count}</TableCell>
                  <TableCell>{`${Math.ceil(
                    guest.total_seconds_on_site / 60 / 60
                  )} часов ${Math.floor(
                    (guest.total_seconds_on_site / 60) % 60
                  )} минут ${Math.floor(
                    guest.total_seconds_on_site % 60
                  )} секунд`}</TableCell>
                  <TableCell
                    className={cn(guest.is_online && "text-green-500")}
                  >
                    {guest.is_online ? "Сейчас на сайте" : "Не в сети"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <Footer
            onChangeRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            offset={offset}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            total={guestsQuery.data?.total || 0}
          />
        </Table>
      </CardContent>
    </Card>
  );
};
