import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Upload,
  FileText,
  Loader2,
  ShieldAlert,
  Sparkles,
  Zap,
  Key,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProcessPdf } from "../../api/use-process-pdf";
import { useCreateSource } from "../../api/use-create-source";
import { useGeminiKey } from "@/features/settings/api/use-gemini-key";
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

  // Quick in-place API Key dialog state
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [quickApiKey, setQuickApiKey] = useState("");

  const { status: keyStatus, saveKey, isSaving } = useGeminiKey();
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
    setStageMessage("Reading pages & indexing content...");

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) {
          setStageMessage("Identifying question patterns...");
          return prev + 5;
        } else if (prev < 75) {
          setStageMessage("Extracting & structuring MCQs...");
          return prev + 2;
        } else if (prev < 92) {
          setStageMessage("Validating schema & formatting output...");
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

      // 2. Process PDF via document parser (In-Memory Base64)
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

  const handleSaveQuickKey = async () => {
    if (!quickApiKey.trim()) return;
    try {
      await saveKey(quickApiKey);
      setShowKeyDialog(false);
      setError(null);
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle>Import PDF</CardTitle>
              <CardDescription>
                Upload a PDF document and we'll automatically extract the multiple choice questions
                from it.
              </CardDescription>
            </div>

            {/* AI Engine Status Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {keyStatus.source === "custom" ? (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs py-1 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Personal Key Active
                </Badge>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowKeyDialog(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2.5 py-1 rounded-full border transition-colors"
                >
                  <Zap className="size-3 text-amber-500" />
                  <span>Shared Quota (Add Custom Key)</span>
                </button>
              )}
            </div>
          </div>
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
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
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
            <Alert variant="destructive" className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <div className="space-y-1">
                  <AlertTitle>Extraction Error</AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed">{error}</AlertDescription>
                </div>
              </div>

              {/* Quick Action to Add Custom Key if error happens */}
              {(error.includes("quota") ||
                error.includes("rate limit") ||
                error.includes("Key") ||
                error.includes("key")) && (
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeyDialog(true)}
                    className="bg-background text-foreground text-xs"
                  >
                    <Key className="size-3.5 mr-1.5 text-primary" />
                    Add Free Gemini API Key
                  </Button>
                </div>
              )}
            </Alert>
          )}

          {isProcessing && (
            <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{stageMessage || "Processing document..."}</span>
                </div>
                <span className="font-semibold text-primary">{Math.min(progress, 100)}%</span>
              </div>

              <Progress value={progress} className="h-2 w-full" />

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  Please do not close this tab or refresh the page while questions are being
                  extracted.
                </span>
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

      {/* Quick In-Place Gemini API Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="size-5 text-primary" />
              Configure Personal Gemini API Key
            </DialogTitle>
            <DialogDescription>
              Add your free Google Gemini API key to avoid shared rate limit issues and extract MCQs
              with full speed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Google Gemini API Key
              </label>
              <Input
                type="password"
                placeholder="AIzaSy... (Paste your key here)"
                value={quickApiKey}
                onChange={(e) => setQuickApiKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Don't have a key yet? Get one 100% free from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline font-medium inline-flex items-center gap-0.5"
                >
                  Google AI Studio <ExternalLink className="size-2.5" />
                </a>
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setShowKeyDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveQuickKey}
              disabled={!quickApiKey.trim() || isSaving}
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                <CheckCircle2 className="size-4 mr-1.5" />
              )}
              Save & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
