import React from "react";
import Link from "next/link";
import { Frown } from "lucide-react";

interface NotFoundProps {
  title?: string;
  subtitle?: string;
  backUrl?: string;
}

export const PageNotFound: React.FC<NotFoundProps> = ({ title = "404 Not Found", subtitle, backUrl = "/" }) => {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="size-32 text-gray-400" />
      <h2 className="text-3xl font-medium">{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      <Link
        href={backUrl}
        className="mt-4 rounded-md bg-cyan-800 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
      >
        Go Back
      </Link>
    </main>
  );
};
