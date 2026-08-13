import { Download, Loader2 } from "lucide-react";
import { useDataSummary } from "../api/use-data-summary";
import { useExportData } from "../api/use-export-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DataManagementSettings() {
  const { data: summary, isLoading: isLoadingSummary } = useDataSummary();
  const { exportData, isExporting, error } = useExportData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
          <CardDescription>Overview of the data you own in QBank.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSummary ? (
            <div className="flex justify-center p-4">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold">{summary?.questionBanks || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Question Banks</div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold">{summary?.questions || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Questions</div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold">{summary?.tests || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Tests Created</div>
              </div>
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold">{summary?.attempts || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Attempts Logged</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download a copy of all your data (Profile, Banks, Tests, and Attempts) in JSON format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Export Failed</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-between items-center rounded-lg border p-4">
            <div>
              <p className="font-medium text-sm">Download JSON Archive</p>
              <p className="text-sm text-muted-foreground">Includes all your personal data.</p>
            </div>
            <Button onClick={exportData} disabled={isExporting}>
              {isExporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
