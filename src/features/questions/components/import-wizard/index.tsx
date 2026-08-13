import { useState } from "react";
import { SourceSelector } from "./source-selector";
import { JsonImport } from "./json-import";
import { PdfImport } from "./pdf-import";
import { ImportReview } from "./import-review";
import { ImportSummary } from "./import-summary";
import type { ParsedQuestionResult } from "./schema";
import { useImportQuestions } from "../../api/use-import-questions";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

type WizardStep = "source" | "upload" | "review" | "summary";

interface ImportWizardProps {
  bankId: string;
}

export function ImportWizard({ bankId }: ImportWizardProps) {
  const [step, setStep] = useState<WizardStep>("source");
  const [sourceType, setSourceType] = useState<"json" | "pdf" | null>(null);
  const [parsedResults, setParsedResults] = useState<ParsedQuestionResult[]>([]);
  const [sourceId, setSourceId] = useState<string | undefined>();
  const [importStats, setImportStats] = useState({ detected: 0, imported: 0, skipped: 0 });
  
  const importMutation = useImportQuestions();

  const handleSourceSelect = (type: "json" | "pdf") => {
    setSourceType(type);
    setStep("upload");
  };

  const handleUploadComplete = (results: ParsedQuestionResult[], uploadedSourceId?: string) => {
    setParsedResults(results);
    setSourceId(uploadedSourceId);
    setStep("review");
  };

  const handleImport = async (selectedQuestions: ParsedQuestionResult[]) => {
    try {
      const validQuestions = selectedQuestions.map(q => q.data!);
      
      await importMutation.mutateAsync({
        bankId,
        sourceId,
        // map snake_case RawQuestion to Question format
        questions: validQuestions.map(q => ({
          questionText: q.question_text,
          optionA: q.option_a,
          optionB: q.option_b,
          optionC: q.option_c,
          optionD: q.option_d,
          correctAnswer: q.correct_answer as "A" | "B" | "C" | "D",
          explanation: q.explanation || null,
          difficulty: q.difficulty as any || null,
          topic: q.topic || null,
          sourceReference: q.source_reference || null,
        })),
      });

      setImportStats({
        detected: parsedResults.length,
        imported: selectedQuestions.length,
        skipped: parsedResults.length - selectedQuestions.length,
      });

      toast.success("Import completed successfully");
      setStep("summary");
    } catch (err: any) {
      toast.error(err.message || "Failed to import questions");
    }
  };

  const handleCancel = () => {
    setStep("source");
    setSourceType(null);
    setParsedResults([]);
    setSourceId(undefined);
  };

  const renderBreadcrumbs = () => {
    const steps = [
      { id: "source", label: "Source", active: step === "source" },
      { id: "upload", label: "Upload", active: step === "upload" },
      { id: "review", label: "Review", active: step === "review" },
      { id: "summary", label: "Summary", active: step === "summary" },
    ];

    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center space-x-2">
            <span className={s.active ? "text-foreground font-medium" : ""}>
              {s.label}
            </span>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {renderBreadcrumbs()}
      
      {step === "source" && (
        <SourceSelector onSelect={handleSourceSelect} />
      )}
      
      {step === "upload" && sourceType === "json" && (
        <JsonImport onComplete={handleUploadComplete} onCancel={handleCancel} />
      )}
      
      {step === "upload" && sourceType === "pdf" && (
        <PdfImport bankId={bankId} onComplete={handleUploadComplete} onCancel={handleCancel} />
      )}
      
      {step === "review" && (
        <ImportReview 
          results={parsedResults} 
          onImport={handleImport} 
          onCancel={handleCancel}
          isImporting={importMutation.isPending}
        />
      )}
      
      {step === "summary" && (
        <ImportSummary 
          bankId={bankId}
          totalDetected={importStats.detected}
          totalImported={importStats.imported}
          totalSkipped={importStats.skipped}
        />
      )}
    </div>
  );
}
