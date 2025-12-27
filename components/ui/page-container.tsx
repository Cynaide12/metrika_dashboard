"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full h-full flex-1 min-h-screen max-w-svw pt-2 pl-1",
        className
      )}
      {...props}
    />
  )
}

export { PageContainer }
