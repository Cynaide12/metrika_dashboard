"use client"

import { getRecordEvents } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const GuestPage = () => {
  const { id } = useParams();
  const getGuestEvents = useQuery({
    queryKey: ["guest", id],
    queryFn: () => getRecordEvents(1, Number(id)),
  });

  if (getGuestEvents.isLoading) return null;

  return (
    <div>
      {getGuestEvents.data?.events.map((item) => (
        <div>
          {item.id}
          {item.data}
          {item.timestamp}
        </div>
      ))}
    </div>
  );
};

export default GuestPage
