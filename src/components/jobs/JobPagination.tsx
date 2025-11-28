// src/components/jobs/JobPagination.tsx

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function JobPagination({ currentPage, totalPages, onPageChange }: JobPaginationProps) {
  const { t } = useLanguage();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (showEllipsisStart) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (showEllipsisEnd) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
        {t.pagination.previous}
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-1.5 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`rounded-full min-w-[40px] ${
                  currentPage === page
                    ? "bg-[#1e3a8a] hover:bg-[#1e40af]"
                    : "hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        {t.pagination.next}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
