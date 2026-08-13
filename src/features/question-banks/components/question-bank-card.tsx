import { Link } from "@tanstack/react-router";
import { Book, Edit2, MoreVertical, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/routes";
import type { QuestionBank } from "@/types/domain";

interface QuestionBankCardProps {
  bank: QuestionBank;
  onEdit: (bank: QuestionBank) => void;
  onDelete: (bank: QuestionBank) => void;
}

export function QuestionBankCard({ bank, onEdit, onDelete }: QuestionBankCardProps) {
  const formattedDate = new Date(bank.updatedAt).toLocaleDateString();

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 truncate pr-4">
          <CardTitle className="truncate text-lg font-bold" title={bank.name}>
            <Link
              to={ROUTES.questionBank(bank.id)}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {bank.name}
            </Link>
          </CardTitle>
          {bank.subject && (
            <CardDescription className="truncate" title={bank.subject}>
              {bank.subject}
            </CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-2 h-8 w-8 text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(bank)}>
              <Edit2 className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(bank)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        {bank.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2" title={bank.description}>
            {bank.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}

        {bank.topic && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="truncate max-w-full font-normal">
              {bank.topic}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Book className="h-3.5 w-3.5" />
          <span>
            {bank.questionCount} {bank.questionCount === 1 ? "question" : "questions"}
          </span>
        </div>
        <div>Updated {formattedDate}</div>
      </CardFooter>
    </Card>
  );
}
