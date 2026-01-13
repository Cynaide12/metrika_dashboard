"use client";

import { getGuests } from "@/api/api";
import { Button } from "@/components/ui/button";
import { CalendarDropdown } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react";
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
                  isActive={offset - rowsPerPage >= 0}
                  className="cursor-pointer transition-colors"
                  hiddenText
                  onClick={handlePrevPage}
                />
                <PaginationNext
                  isActive={offset + rowsPerPage <= total}
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

const Header = ({
  onChangeOrder,
  order,
}: {
  onChangeOrder: (val: { order?: string; order_type?: string }) => void;
  order?: { order?: string; order_type?: string };
}) => {
  const handleChangeOrder = (orderName: string) => {
    let orderType: string;
    switch (order?.order_type) {
      case '':
        orderType = "ASC";
        break;
      case "ASC":
        orderType = "DESC";
        break;
      case "DESC":
        orderType = '';
        orderName = '';
        break;
      default:
        orderType = "ASC";
    }
    console.log(orderName, orderType)
    onChangeOrder({
      order: orderName,
      order_type: orderType,
    });
  };

  return (
    <TableHeader className="sticky top-0 z-10 bg-muted">
      <TableRow>
        {headers.map((h) => (
          <TableHead className="py-5" key={h.order_name}>
            <div
              className="w-fit flex cursor-pointer"
              onClick={() => handleChangeOrder(h.order_name)}
            >
              {h.name}
              {order?.order == h.order_name ? (
                order.order_type == "ASC" ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )
              ) : (
                <ChevronsUpDownIcon />
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

var headers: { name: string; order_name: string }[] = [
  { name: "ID посетителя", order_name: "guest_id" },
  { name: "Первый визит", order_name: "first_visit" },
  { name: "Последний визит", order_name: "last_visit" },
  { name: "Всего визитов", order_name: "sessions_count" },
  { name: "Общее время на сайте", order_name: "total_seconds_on_site" },
  { name: "Статус", order_name: "is_online" },
];

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
  const [order, setOrder] = useState<
    { order?: string; order_type?: string } | undefined
  >({order: "last_visit", order_type: "DESC"});

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
      order,
    ],
    //!когда нибудь уже наконец сделать создание и выбор домена
    queryFn: () =>
      getGuests(2, {
        start_date: selectedDateRange?.from?.toISOString(),
        end_date: selectedDateRange?.to?.toISOString(),
        offset: offset,
        limit: rowsPerPage,
        order: order?.order,
        order_type: order?.order_type,
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

  const handleChangeOrder = (val: { order?: string; order_type?: string }) => {
    setOrder(val);
  };

  return (
    <div className="max-h-screen h-screen relative p-2">
      <Card className="h-full flex flex-col">
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
        <CardContent className="flex-1 relative overflow-y-auto">
          <Table
            className="relative h-screen"
            containerClassname="*:data-[slot=table-container]:overflow-y-auto rounded-md border"
          >
            <Header onChangeOrder={handleChangeOrder} order={order} />
            <TableBody className="h-full">
              {guestsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0" rowSpan={10}>
                    <Skeleton className="h-full w-full" />
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
    </div>
  );
};
