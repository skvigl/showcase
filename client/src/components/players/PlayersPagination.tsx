"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PaginationNav } from "@/shared/Pagination";

export const PlayersPagination = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const page = Number(searchParams.get("page")) || 1;

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-8">
      <PaginationNav current={page} pageSize={20} total={80} onChange={handleChange} />
    </div>
  );
};
