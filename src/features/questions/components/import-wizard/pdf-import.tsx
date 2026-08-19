import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload, FileText, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useProcessPdf } from "../../api/use-process-pdf";
import { useCreateSource } from "../../api/use-create-source";
import type { ParsedQuestionResult, RawQuestion } from "./schema";
import { rawQuestionSchema } from "./schema";

interface PdfImportProps {
  bankId: string;
  onComplete: (results: ParsedQuestionResult[], sourceId: string) => void;
  onCancel: () => void;
}

export function PdfImport({ bankId, onComplete, onCancel }: PdfImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing">("idle");
  
  const processPdfMutation = useProcessPdf();
  const createSourceMutation = useCreateSource();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      setFile(null);
      return;
    }
    
    // 20MB limit
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size exceeds 20MB limit.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const processFile = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setStatus("processing");
      
      // 1. Create Source Audit Record (storagePath is null since raw PDF is not permanently stored)
      const sourceRecord = await createSourceMutation.mutateAsync({
        bankId,
        fileName: file.name,
        kind: "pdf",
        storagePath: null,
        fileSize: file.size,
        status: "processing",
        totalQuestions: 0,
        importedQuestions: 0,
      });

      // 2. Process PDF directly with Gemini AI (In-Memory Base64)
      const rawQuestions: RawQuestion[] = await processPdfMutation.mutateAsync({
        file,
      });
      
      // 3. Validate and format results
      const results: ParsedQuestionResult[] = rawQuestions.map((item, index) => {
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
            data: item as any,
            error: validation.error.errors[0]?.message || "Invalid structure",
            status: "needs_review",
          };
        }
      });
      
      // 4. Update Source Record with question count
      await supabase
        .from("uploaded_sources")
        .update({
          status: "review",
          total_questions: results.length,
        })
        .eq("id", sourceRecord.id);

      onComplete(results, sourceRecord.id);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import PDF</CardTitle>
          <CardDescription>
            Upload a PDF document. Our AI will securely extract the multiple choice questions from it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/10 hover:bg-muted/30 transition-colors">
            {file ? (
              <div className="flex items-center gap-4 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {status === "idle" && (
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-sm font-medium">Click or drag PDF here</p>
                  <p className="text-xs text-muted-foreground">PDF up to 20MB</p>
                </div>
                <Input 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {status !== "idle" && (
             <Alert className="bg-primary/10 border-primary/20">
               <Loader2 className="h-4 w-4 animate-spin text-primary" />
               <AlertTitle className="text-primary">
                 {status === "uploading" ? "Uploading Document..." : "Processing with AI..."}
               </AlertTitle>
               <AlertDescription className="text-primary/80">
                 {status === "uploading" 
                   ? "Securely uploading your file." 
                   : "Extracting questions. This might take a minute depending on document length."}
               </AlertDescription>
             </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel} disabled={status !== "idle"}>
              Cancel
            </Button>
            <Button onClick={processFile} disabled={!file || status !== "idle"}>
              {status !== "idle" ? "Processing..." : "Process PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
