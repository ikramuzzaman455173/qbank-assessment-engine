import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, MinusCircle, Info } from "lucide-react";
import type { TestQuestion, AttemptAnswer, CorrectAnswer } from "@/types/domain";

interface ResultQuestionReviewProps {
  questions: TestQuestion[];
  answers: AttemptAnswer[];
}

export function ResultQuestionReview({ questions, answers }: ResultQuestionReviewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Question Breakdown</h3>
      <div className="space-y-6">
        {questions.map((question, index) => {
          const answer = answers.find((a) => a.testQuestionId === question.id);
          const isCorrect = answer?.isCorrect;
          const isUnanswered = !answer?.selectedAnswer;

          return (
            <Card key={question.id} className={`overflow-hidden border-l-4 ${isCorrect ? 'border-l-green-500' : isUnanswered ? 'border-l-gray-300' : 'border-l-red-500'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="font-medium text-lg leading-relaxed">
                    <span className="text-muted-foreground mr-2">{index + 1}.</span>
                    {question.questionText}
                  </div>
                  <div className="shrink-0 mt-1">
                    {isCorrect && <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Correct</Badge>}
                    {isUnanswered && <Badge variant="outline" className="text-muted-foreground"><MinusCircle className="w-3 h-3 mr-1" /> Unanswered</Badge>}
                    {!isCorrect && !isUnanswered && <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Incorrect</Badge>}
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {(['A', 'B', 'C', 'D'] as CorrectAnswer[]).map((opt) => {
                    const isSelected = answer?.selectedAnswer === opt;
                    const isActuallyCorrect = question.correctAnswer === opt;
                    
                    let bgClass = "bg-background border-border";
                    let icon = null;

                    if (isActuallyCorrect) {
                      bgClass = "bg-green-50 border-green-200 text-green-900";
                      icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
                    } else if (isSelected && !isActuallyCorrect) {
                      bgClass = "bg-red-50 border-red-200 text-red-900";
                      icon = <XCircle className="w-5 h-5 text-red-600" />;
                    }

                    return (
                      <div key={opt} className={`flex items-center justify-between p-4 rounded-lg border ${bgClass}`}>
                        <div className="flex items-center">
                          <span className="font-semibold mr-3">{opt}.</span>
                          <span>{question[`option${opt}` as keyof TestQuestion]}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>

                {question.explanation && (
                  <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-blue-900">
                    <div className="flex items-center gap-2 font-semibold mb-1 text-blue-800">
                      <Info className="w-4 h-4" /> Explanation
                    </div>
                    {question.explanation}
                  </div>
                )}
                
                {question.sourceReference && (
                  <div className="mt-4 text-xs text-muted-foreground flex items-center">
                    <span className="font-medium mr-1">Source Reference:</span> {question.sourceReference}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
