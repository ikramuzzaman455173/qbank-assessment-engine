import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { rawQuestionSchema, type ParsedQuestionResult } from "./schema";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface JsonImportProps {
  onComplete: (results: ParsedQuestionResult[]) => void;
  onCancel: () => void;
}

export function JsonImport({ onComplete, onCancel }: JsonImportProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        setError(null);
      } catch (err) {
        setError("Failed to read file.");
      }
    };
    reader.readAsText(file);
  };

  const processJson = () => {
    try {
      if (!jsonText.trim()) {
        setError("Please provide JSON content.");
        return;
      }
      
      const parsed = JSON.parse(jsonText);
      const arrayToProcess = Array.isArray(parsed) 
        ? parsed 
        : parsed.questions && Array.isArray(parsed.questions)
        ? parsed.questions
        : [parsed]; // fallback to trying to parse a single object

      const results: ParsedQuestionResult[] = arrayToProcess.map((item: any, index: number) => {
        const validation = rawQuestionSchema.safeParse(item);
        if (validation.success) {
          return {
            originalIndex: index,
            data: validation.data,
            error: null,
            status: "valid",
          };
        } else {
          return {
            originalIndex: index,
            data: item, // keep original to show in review
            error: validation.error.errors[0]?.message || "Invalid structure",
            status: "invalid",
          };
        }
      });

      onComplete(results);
    } catch (err) {
      setError("Invalid JSON format. Please check your syntax.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import JSON</CardTitle>
          <CardDescription>
            Upload a .json file or paste your JSON content directly.
            The JSON should be an array of questions or an object with a "questions" array.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button variant="outline" className="shrink-0" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </label>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or paste JSON
              </span>
            </div>
          </div>

          <Textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            placeholder={'[\n  {\n    "question_text": "...",\n    "option_a": "...",\n    "option_b": "...",\n    "option_c": "...",\n    "option_d": "...",\n    "correct_answer": "A"\n  }\n]'}
            className="font-mono text-sm min-h-[300px]"
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={processJson}>
              Process JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
