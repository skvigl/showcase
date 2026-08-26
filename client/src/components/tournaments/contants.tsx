import { ReactNode } from "react";

export type Season = "winter" | "spring" | "summer" | "autumn";

export const icons: Record<Season, ReactNode> = {
  winter: (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 4l2 1l2 -1" />
      <path d="M12 2v6.5l3 1.72" />
      <path d="M17.928 6.268l.134 2.232l1.866 1.232" />
      <path d="M20.66 7l-5.629 3.25l.01 3.458" />
      <path d="M19.928 14.268l-1.866 1.232l-.134 2.232" />
      <path d="M20.66 17l-5.629 -3.25l-2.99 1.738" />
      <path d="M14 20l-2 -1l-2 1" />
      <path d="M12 22v-6.5l-3 -1.72" />
      <path d="M6.072 17.732l-.134 -2.232l-1.866 -1.232" />
      <path d="M3.34 17l5.629 -3.25l-.01 -3.458" />
      <path d="M4.072 9.732l1.866 -1.232l.134 -2.232" />
      <path d="M3.34 7l5.629 3.25l2.99 -1.738" />
    </svg>
  ),

  spring: (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3" />
    </svg>
  ),

  summer: (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.828 14.828a4 4 0 1 0-5.656-5.656a4 4 0 0 0 5.656 5.656" />
      <path d="M6.343 17.657l-1.414 1.414" />
      <path d="M6.343 6.343l-1.414-1.414" />
      <path d="M17.657 6.343l1.414-1.414" />
      <path d="M17.657 17.657l1.414 1.414" />
      <path d="M4 12h-2" />
      <path d="M12 4v-2" />
      <path d="M20 12h2" />
      <path d="M12 20v2" />
    </svg>
  ),

  autumn: (
    <svg
      viewBox="0 0 24 24"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 21c.5-4.5 2.5-8 7-10" />
      <path d="M9 18c6.218 0 10.5-3.288 11-12v-2h-4.014c-9 0-11.986 4-12 9c0 1 0 3 2 5h3" />
    </svg>
  ),
};
