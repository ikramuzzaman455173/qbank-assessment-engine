import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson, FileText } from "lucide-react";

interface SourceSelectorProps {
  onSelect: (source: "json" | "pdf") => void;
}

export function SourceSelector({ onSelect }: SourceSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Select Import Source</h2>
        <p className="text-muted-foreground">
          Choose how you want to import your multiple choice questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onSelect("json")}
        >
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
              <FileJson className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>JSON Import</CardTitle>
            <CardDescription>
              Upload a JSON file or paste JSON text containing structured MCQs.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onSelect("pdf")}
        >
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>PDF Import</CardTitle>
            <CardDescription>
              Upload a PDF document and use AI to automatically extract MCQs.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
