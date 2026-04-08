"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface MatchDateProps {
  date: string;
  type?: "datetime" | "date" | "time";
}

export const MatchDate: React.FC<MatchDateProps> = ({ date, type = "datetime" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let formatStr = "";

  switch (type) {
    case "date":
      formatStr = "dd.MM.yyyy";
      break;
    case "time":
      formatStr = "HH:mm";
      break;
    case "datetime":
    default:
      formatStr = "dd.MM.yyyy HH:mm";
  }

  return <>{format(date, formatStr)}</>;
};
