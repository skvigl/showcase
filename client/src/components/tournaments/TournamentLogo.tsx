import { cn } from "@/shared/utils";
import { icons, Season } from "./contants";

type TournamentLogoProps = {
  season: Season;
  name?: string;
  year: number;
  place?: number | string;
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
};

const seasonStyles: Record<Season, { border: string; text: string; badge: string }> = {
  winter: { border: "border-sky-200", text: "text-sky-600", badge: "bg-sky-100 text-sky-700" },
  spring: { border: "border-emerald-200", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  summer: { border: "border-amber-200", text: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  autumn: { border: "border-orange-200", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
};

export function TournamentLogo({ season, name, year, place, size = "md", bordered = true }: TournamentLogoProps) {
  const style = seasonStyles[season];
  const shortYear = String(year).slice(-2);
  const formattedPlace = typeof place === "number" ? `#${place}` : place;

  const sizeClasses = {
    sm: `w-12 h-12 text-[10px] rounded-lg p-1 ${bordered ? "border" : ""}`,
    md: `w-16 h-16 text-sm rounded-lg p-1.5 ${bordered ? "border-2" : ""}`,
    lg: `w-20 h-20 text-lg rounded-lg p-2 ${bordered ? "border-2" : ""}`,
  }[size];

  return (
    <div
      title={name}
      className={cn(
        sizeClasses,
        bordered ? style.border : "",
        style.text,
        "bg-white",
        "relative flex flex-col justify-between",
        "select-none shrink-0 overflow-hidden",
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        {icons[season]}
      </div>

      {place ? (
        <span className={`self-start font-bold px-1 py-0.5 rounded ${style.badge} leading-none`}>{formattedPlace}</span>
      ) : (
        <div />
      )}

      <span className="font-bold leading-none ml-auto">{shortYear}</span>
    </div>
  );
}
