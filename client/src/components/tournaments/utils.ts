import { Season } from "./contants";

export function getSeason(date: Date): Season {
  const month = date.getMonth();
  if (month === 11 || month <= 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "autumn";
}
