import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";

interface ImportSummaryProps {
  bankId: string;
  totalDetected: number;
  totalImported: number;
  totalSkipped: number;
}

export function ImportSummary({
  bankId,
  totalDetected,
  totalImported,
  totalSkipped,
}: ImportSummaryProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>Import Complete</CardTitle>
          <CardDescription>Your questions have been successfully imported.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center divide-x border rounded-lg p-4 bg-muted/20">
            <div>
              <p className="text-2xl font-bold">{totalDetected}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Detected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalImported}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Imported</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">{totalSkipped}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Skipped</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link to={ROUTES.questionBank(bankId)}>
                Return to Question Bank
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
