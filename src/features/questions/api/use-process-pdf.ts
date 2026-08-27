import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProcessPdfArgs {
  file?: File;
  storagePath?: string;
}

// Convert File / Blob directly to Base64 in browser without storing
async function fileToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      if (base64) {
        resolve(base64);
      } else {
        reject(new Error("Failed to encode PDF to base64"));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Failed to read PDF file"));
    reader.readAsDataURL(blob);
  });
}

export function useProcessPdf() {
  return useMutation({
    mutationFn: async ({ file, storagePath }: ProcessPdfArgs) => {
      // 1. Check for API key
      const geminiApiKey = import.meta.env["VITE_GEMINI_API_KEY"];
      if (!geminiApiKey) {
        throw new Error(
          "Missing VITE_GEMINI_API_KEY in your .env file. Please get a free API key from Google AI Studio (aistudio.google.com) and add it to your .env file."
        );
      }

      let base64Data = "";

      // 2. Obtain base64: either directly from local File (0 storage cost) or from Supabase Storage
      if (file) {
        base64Data = await fileToBase64(file);
      } else if (storagePath) {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("question-sources")
          .download(storagePath);

        if (downloadError || !fileData) {
          throw new Error("Failed to download PDF from storage: " + (downloadError?.message || "Unknown error"));
        }
        base64Data = await fileToBase64(fileData);
      } else {
        throw new Error("No PDF file or storage path provided for processing.");
      }

      // 3. Structured Output JSON Schema for Gemini
      const responseSchema = {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question_text: { type: "string" },
                option_a: { type: "string" },
                option_b: { type: "string" },
                option_c: { type: "string" },
                option_d: { type: "string" },
                correct_answer: { type: "string", enum: ["A", "B", "C", "D"] },
                explanation: { type: "string" },
                difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                topic: { type: "string" },
                source_reference: { type: "string" },
              },
              required: ["question_text", "option_a", "option_b", "option_c", "option_d", "correct_answer"],
            },
          },
        },
        required: ["questions"],
      };

      const prompt = `Extract all multiple choice questions from this document.
Rules:
1. Extract only MCQs present in the supplied document.
2. Do not invent questions.
3. Do not add outside knowledge.
4. Do not infer a missing answer unless explicitly supported.
5. If information is incomplete, extract it exactly as it appears.
6. Provide a source_reference if possible (e.g., page number).
7. Format the output strictly matching the requested JSON schema.`;

      const requestBody = {
        contents: [
          {
            parts: [
              { inline_data: { mime_type: "application/pdf", data: base64Data } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: responseSchema,
        },
      };

      const candidateModels = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.1-pro",
      ];
      let lastErrorText = "";

      for (const model of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!rawText) {
              throw new Error("No response text returned from AI model");
            }

            const parsedOutput = JSON.parse(rawText);
            return parsedOutput.questions || [];
          } else {
            lastErrorText = await geminiRes.text();
            console.warn(`Model ${model} failed with: ${lastErrorText}, trying fallback...`);
          }
        } catch (err: any) {
          lastErrorText = err.message || String(err);
          console.warn(`Request to ${model} threw error:`, err);
        }
      }

      console.error("Gemini API Error details:", lastErrorText);
      throw new Error(`Failed to process PDF with AI: ${lastErrorText || "Check console for details."}`);
    },
  });
}
