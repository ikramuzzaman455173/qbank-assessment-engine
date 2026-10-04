import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuestionForm, type QuestionValues } from "../question-form";
import type { ParsedQuestionResult, RawQuestion } from "./schema";
import { rawQuestionSchema } from "./schema";
import { AlertCircle, CheckCircle2, Edit2 } from "lucide-react";

interface ImportReviewProps {
  results: ParsedQuestionResult[];
  onImport: (selectedQuestions: ParsedQuestionResult[]) => void;
  onCancel: () => void;
  isImporting?: boolean;
}

export function ImportReview({
  results: initialResults,
  onImport,
  onCancel,
  isImporting,
}: ImportReviewProps) {
  const [results, setResults] = useState<ParsedQuestionResult[]>(initialResults);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(() => {
    // Select all valid ones by default
    const validIndices = initialResults
      .filter((r) => r.status === "valid")
      .map((r) => r.originalIndex);
    return new Set(validIndices);
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const selectAll = () => {
    setSelectedIndices(new Set(results.map((r) => r.originalIndex)));
  };

  const selectNone = () => {
    setSelectedIndices(new Set());
  };

  const selectValid = () => {
    const validIndices = results.filter((r) => r.status === "valid").map((r) => r.originalIndex);
    setSelectedIndices(new Set(validIndices));
  };

  const handleEditSubmit = (values: RawQuestion) => {
    if (editingIndex === null) return;

    // The QuestionValues matches our Question structure exactly.
    // Validate to make sure
    const validation = rawQuestionSchema.safeParse(values);

    setResults((prev) =>
      prev.map((item) => {
        if (item.originalIndex === editingIndex) {
          if (validation.success) {
            return {
              ...item,
              data: validation.data,
              error: null,
              status: "valid",
            };
          } else {
            return {
              ...item,
              data: values, // Keep the edited values even if invalid
              error: validation.error.errors[0]?.message || "Invalid",
              status: "invalid",
            };
          }
        }
        return item;
      }),
    );

    setEditingIndex(null);
  };

  const handleImport = () => {
    const selected = results.filter((r) => selectedIndices.has(r.originalIndex));
    // We only pass the selected ones back
    onImport(selected);
  };

  const editingItem =
    editingIndex !== null ? results.find((r) => r.originalIndex === editingIndex) : null;

  const validCount = results.filter((r) => r.status === "valid").length;
  const invalidCount = results.filter((r) => r.status === "invalid").length;
  const reviewCount = results.filter((r) => r.status === "needs_review").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Extracted Questions</CardTitle>
          <CardDescription>
            Review the extracted questions before importing. You can edit items that need review or
            fix invalid ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Badge variant="outline" className="px-3 py-1">
              Total: {results.length}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-green-600 border-green-600 bg-green-50"
            >
              Valid: {validCount}
            </Badge>
            {reviewCount > 0 && (
              <Badge
                variant="outline"
                className="px-3 py-1 text-yellow-600 border-yellow-600 bg-yellow-50"
              >
                Needs Review: {reviewCount}
              </Badge>
            )}
            {invalidCount > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-red-600 border-red-600 bg-red-50">
                Invalid: {invalidCount}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectNone}>
              Select None
            </Button>
            <Button variant="outline" size="sm" onClick={selectValid}>
              Select Valid
            </Button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {results.map((result) => {
              const isSelected = selectedIndices.has(result.originalIndex);

              return (
                <div
                  key={result.originalIndex}
                  className={`flex gap-4 p-4 rounded-lg border ${isSelected ? "border-primary bg-primary/5" : "border-border"} transition-colors`}
                >
                  <div className="pt-1">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(result.originalIndex)}
                      disabled={result.status !== "valid"}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-medium text-sm">
                        {result.data?.question_text || "Missing Question Text"}
                      </h4>
                      <div className="flex gap-2 items-center shrink-0">
                        {result.status === "valid" && <Badge className="bg-green-600">Valid</Badge>}
                        {result.status === "needs_review" && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Needs Review
                          </Badge>
                        )}
                        {result.status === "invalid" && (
                          <Badge variant="destructive">Invalid</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingIndex(result.originalIndex)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {result.error && (
                      <div className="flex items-center gap-2 text-sm text-destructive mt-2 bg-destructive/10 p-2 rounded">
                        <AlertCircle className="h-4 w-4" />
                        <span>{result.error}</span>
                      </div>
                    )}

                    {result.status === "valid" && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Ready to import</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {selectedIndices.size} selected for import
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} disabled={isImporting}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={selectedIndices.size === 0 || isImporting}>
                {isImporting ? "Importing..." : `Import ${selectedIndices.size} Questions`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Correct any missing or ambiguous information before importing.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <QuestionForm
              // We map RawQuestion snake_case to QuestionValues camelCase for the form
              initialValues={{
                questionText: editingItem.data?.question_text || "",
                optionA: editingItem.data?.option_a || "",
                optionB: editingItem.data?.option_b || "",
                optionC: editingItem.data?.option_c || "",
                optionD: editingItem.data?.option_d || "",
                correctAnswer: (editingItem.data?.correct_answer as any) || "",
                explanation: editingItem.data?.explanation || "",
                difficulty: (editingItem.data?.difficulty as any) || undefined,
                topic: editingItem.data?.topic || "",
                sourceReference: editingItem.data?.source_reference || "",
              }}
              onSubmit={(values) => {
                // We must map it back to snake_case for the schema validation inside handleEditSubmit
                handleEditSubmit({
                  question_text: values.questionText,
                  option_a: values.optionA,
                  option_b: values.optionB,
                  option_c: values.optionC,
                  option_d: values.optionD,
                  correct_answer: values.correctAnswer,
                  explanation: values.explanation,
                  difficulty: values.difficulty,
                  topic: values.topic,
                  source_reference: values.sourceReference,
                } as any);
              }}
              onCancel={() => setEditingIndex(null)}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
