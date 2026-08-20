import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowRight,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AdvancedPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showQuickJumper?: boolean;
  showBatchPills?: boolean;
  showPageSizeSelector?: boolean;
  scrollToTopOnPageChange?: boolean;
  scrollTargetId?: string;
}

export function AdvancedPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  showQuickJumper = true,
  showBatchPills = true,
  showPageSizeSelector = true,
  scrollToTopOnPageChange = true,
  scrollTargetId,
}: AdvancedPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const [jumpPage, setJumpPage] = useState<string>("");

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    if (validPage !== currentPage) {
      onPageChange(validPage);
      if (scrollToTopOnPageChange) {
        if (scrollTargetId) {
          const el = document.getElementById(scrollTargetId);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      handlePageChange(parsed);
      setJumpPage("");
    }
  };

  // Keyboard navigation: Alt + Left / Alt + Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  // Generate page numbers with smart ellipsis
  const getVisiblePages = () => {
    const pages: (number | "ellipsis-left" | "ellipsis-right")[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis-left");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-right");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Generate batch range pills (e.g. 1-25, 26-50, etc. up to 6 batches)
  const batchPills = (() => {
    if (!showBatchPills || totalPages <= 1 || totalPages > 12) return [];
    return Array.from({ length: totalPages }, (_, idx) => {
      const p = idx + 1;
      const bStart = (p - 1) * pageSize + 1;
      const bEnd = Math.min(p * pageSize, totalItems);
      return { page: p, label: `Q: ${bStart}–${bEnd}` };
    });
  })();

  if (totalItems === 0) return null;

  return (
    <div className={cn("space-y-4 pt-4 border-t border-border/70", className)}>
      {/* Batch Range Booklet Pills (For quick section jumping) */}
      {batchPills.length > 0 && batchPills.length <= 8 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Batches:</span>
          </div>
          {batchPills.map((b) => (
            <Button
              key={b.page}
              type="button"
              size="sm"
              variant={b.page === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(b.page)}
              className={cn(
                "h-7 px-2.5 text-xs font-mono rounded-md transition-all",
                b.page === currentPage ? "font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {b.label}
            </Button>
          ))}
        </div>
      )}

      {/* Main Pagination Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Summary & Page Size Selector */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground order-2 sm:order-1">
          <div className="flex items-center gap-1.5">
            <span>Showing</span>
            <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5 font-semibold text-foreground">
              {startItem}–{endItem}
            </Badge>
            <span>of</span>
            <span className="font-semibold text-foreground">{totalItems.toLocaleString()}</span>
            <span>questions</span>
          </div>

          {showPageSizeSelector && onPageSizeChange && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-border">
              <span>Per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => {
                  onPageSizeChange(parseInt(val, 10));
                  onPageChange(1); // Reset to page 1 on page size change
                }}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs font-mono">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent align="end">
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt.toString()} className="text-xs font-mono">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Right Side: Page Controls & Jump Input */}
        <div className="flex flex-wrap items-center gap-1.5 order-1 sm:order-2">
          {/* First Page */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Previous Page (Alt + ←)"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((item, index) => {
              if (item === "ellipsis-left" || item === "ellipsis-right") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-xs text-muted-foreground select-none"
                  >
                    •••
                  </span>
                );
              }

              const isCurrent = item === currentPage;
              return (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={isCurrent ? "default" : "outline"}
                  onClick={() => handlePageChange(item)}
                  className={cn(
                    "h-8 min-w-[32px] px-2 text-xs font-mono rounded-lg transition-all",
                    isCurrent && "font-bold shadow-xs"
                  )}
                >
                  {item}
                </Button>
              );
            })}
          </div>

          {/* Next Page */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Next Page (Alt + →)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          {/* Direct Quick Page Jumper */}
          {showQuickJumper && totalPages > 3 && (
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground hidden sm:inline">Go to:</span>
              <Input
                type="number"
                min={1}
                max={totalPages}
                placeholder="#"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="h-8 w-14 text-center text-xs font-mono px-1 rounded-lg"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                disabled={!jumpPage}
                title="Jump to Page"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
