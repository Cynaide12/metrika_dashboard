"use client";

import { cn } from "@/lib/utils";
import { createContext, FC, PropsWithChildren, useState } from "react";

export const ThemeContext = createContext<{
  theme: string;
  setTheme: (val: string) => void;
}>({ theme: "dark", setTheme(val) {} });
export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  return <ThemeContext value={{ theme, setTheme }}><div className={cn(theme)}>{children}</div></ThemeContext>;
};
