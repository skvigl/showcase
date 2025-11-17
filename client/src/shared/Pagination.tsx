import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/shared/ui/pagination";

interface PaginationNavProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (current: number) => void;
}

export const PaginationNav: React.FC<PaginationNavProps> = ({ current, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        {pages.map((i) => {
          return (
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                isActive={i === current}
                onClick={() => {
                  onChange(i);
                }}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
};
