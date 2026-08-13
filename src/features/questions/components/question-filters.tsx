import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

interface QuestionFiltersProps {
  onFiltersChange: (filters: { searchQuery: string; difficulty: string; topic: string }) => void;
  isLoading?: boolean;
}

export function QuestionFilters({ onFiltersChange, isLoading }: QuestionFiltersProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    onFiltersChange({
      searchQuery: debouncedSearch,
      difficulty,
      topic,
    });
  }, [debouncedSearch, difficulty, topic, onFiltersChange]);

  const handleClear = () => {
    setSearch("");
    setDifficulty("all");
    setTopic("all");
  };

  const hasActiveFilters = search || difficulty !== "all" || topic !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search questions..."
          className="pl-8 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <Select value={difficulty} onValueChange={setDifficulty} disabled={!!isLoading}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Note: Topic is currently a free-text input in the schema. For real-world we'd fetch unique topics or let users type it here. We'll leave it as a simple input or omit it. Since we don't have an aggregation query for unique topics yet, I will leave topic out of this standard filter UI to keep it clean, but could add it later. */}
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
