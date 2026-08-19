import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, FileText, Loader2, ShieldAlert } from "lucide-react";
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
  const [progress, setProgress] = useState<number>(0);
  const [stageMessage, setStageMessage] = useState<string>("");
  
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processPdfMutation = useProcessPdf();
  const createSourceMutation = useCreateSource();

  const isProcessing = status !== "idle";

  // Prevent accidental page reload, tab close, or navigation while processing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (isProcessing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isProcessing]);

  // Clean up progress timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;

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

  const startSimulatedProgress = () => {
    setProgress(15);
    setStageMessage("Reading document & preparing data...");

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) {
          setStageMessage("Initiating extraction session...");
          return prev + 5;
        } else if (prev < 75) {
          setStageMessage("AI is analyzing document & extracting questions...");
          return prev + 2;
        } else if (prev < 92) {
          setStageMessage("Formatting and verifying structured questions...");
          return prev + 1;
        }
        return prev;
      });
    }, 600);
  };

  const stopSimulatedProgress = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const processFile = async () => {
    if (!file || isProcessing) {
      if (!file) setError("Please select a file first.");
      return;
    }

    try {
      setStatus("processing");
      startSimulatedProgress();
      
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
      
      stopSimulatedProgress();
      setProgress(95);
      setStageMessage("Validating extracted questions...");

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

      setProgress(100);
      setStageMessage("Complete!");

      // Short delay for smooth 100% transition
      setTimeout(() => {
        onComplete(results, sourceRecord.id);
      }, 300);
      
    } catch (err: any) {
      stopSimulatedProgress();
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setStatus("idle");
      setProgress(0);
      setStageMessage("");
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
          
          <div 
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-muted/10 transition-colors ${
              isProcessing 
                ? "opacity-60 cursor-not-allowed pointer-events-none" 
                : "hover:bg-muted/30"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-4 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {!isProcessing && (
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
                  disabled={isProcessing}
                  className={`absolute inset-0 w-full h-full opacity-0 ${
                    isProcessing ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
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
          
          {isProcessing && (
            <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{stageMessage || "Processing with AI..."}</span>
                </div>
                <span className="font-semibold text-primary">{Math.min(progress, 100)}%</span>
              </div>
              
              <Progress value={progress} className="h-2 w-full" />
              
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Please do not close this tab or refresh the page while AI is extracting questions.</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onCancel} 
              disabled={isProcessing}
              className={isProcessing ? "cursor-not-allowed opacity-50" : ""}
            >
              Cancel
            </Button>
            <Button 
              onClick={processFile} 
              disabled={!file || isProcessing}
              className={isProcessing ? "cursor-not-allowed" : ""}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing ({progress}%)...
                </>
              ) : (
                "Process PDF"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
