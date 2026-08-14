import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProcessPdfArgs {
  storagePath: string;
}

export function useProcessPdf() {
  return useMutation({
    mutationFn: async ({ storagePath }: ProcessPdfArgs) => {
      // 1. Check for API key
      const geminiApiKey = import.meta.env["VITE_GEMINI_API_KEY"];
      if (!geminiApiKey) {
        throw new Error(
          "Missing VITE_GEMINI_API_KEY in your .env file. Please get a free API key from Google AI Studio (aistudio.google.com) and add it to your .env file."
        );
      }

      // 2. Fetch the PDF from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("question-sources")
        .download(storagePath);

      if (downloadError || !fileData) {
        throw new Error("Failed to download PDF from storage: " + (downloadError?.message || "Unknown error"));
      }

      // 3. Convert PDF to base64 safely
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const chunkSize = 0x8000;
      const chunks = [];
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        chunks.push(String.fromCharCode.apply(null, Array.from(uint8Array.subarray(i, i + chunkSize))));
      }
      const base64Data = btoa(chunks.join(""));

      // 4. Call Gemini API directly
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

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        console.error("Gemini API Error:", errorText);
        throw new Error("Failed to process PDF with AI. Check console for details.");
      }

      const geminiData = await geminiRes.json();
      const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No text returned from Gemini");
      }

      const parsedOutput = JSON.parse(rawText);
      return parsedOutput.questions;
    },
  });
}
