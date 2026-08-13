import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !supabaseServiceRoleKey || !geminiApiKey) {
      throw new Error("Missing environment variables.");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { storagePath } = await req.json();
    if (!storagePath) {
      return new Response(JSON.stringify({ error: "Missing storagePath" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      global: { headers: { Authorization: authHeader } }, // Act as the user to verify access
    });

    // 2. Fetch the PDF from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("question-sources")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return new Response(JSON.stringify({ error: "Failed to download PDF from storage" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Convert PDF to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Efficient base64 encoding in Deno
    const chunk_size = 0x8000;
    const chunks = [];
    for (let i = 0; i < uint8Array.length; i += chunk_size) {
      chunks.push(String.fromCharCode.apply(null, uint8Array.subarray(i, i + chunk_size)));
    }
    const base64Data = btoa(chunks.join(""));

    // 4. Call Gemini API
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
            required: [
              "question_text",
              "option_a",
              "option_b",
              "option_c",
              "option_d",
              "correct_answer",
            ],
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
4. Do not infer a missing answer unless it is explicitly supported by the source.
5. If information is incomplete or ambiguous, do your best to extract it exactly as it appears, but do not invent answers.
6. Provide a source_reference if possible (e.g., page number or section).
7. Format the output strictly matching the requested JSON schema.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: "application/pdf",
                data: base64Data,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: responseSchema,
      },
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini API Error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to process PDF with AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("No text returned from Gemini");
    }

    const parsedOutput = JSON.parse(rawText);

    return new Response(JSON.stringify(parsedOutput), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
