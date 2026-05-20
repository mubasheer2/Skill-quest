import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { domain, difficulty, previousIds } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const domainPrompts: Record<string, string> = {
      fullstack: `Generate a unique frontend web development challenge. The user must build a UI component using HTML, CSS, and JavaScript. Examples: login form, pricing card, dashboard widget, image gallery, nav bar with dropdown, footer, testimonial section, settings panel, chat UI, etc. Be creative and specific about requirements.`,
      sql: `Generate a unique SQL challenge. Provide a scenario with table schemas and ask the user to write a SQL query. Cover: JOINs, GROUP BY, subqueries, window functions, CTEs, aggregations, HAVING, CASE statements, etc. Include the table schemas in the description.`,
      cyber: `Generate a unique cybersecurity challenge. Show a code snippet (JavaScript/Node.js) with a security vulnerability and ask the user to identify and fix it. Cover: SQL injection, XSS, CSRF, insecure auth, broken access control, sensitive data exposure, insecure deserialization, etc.`,
      python: `Generate a unique Python/data science challenge. The user must write Python code. Cover: numpy operations, pandas data manipulation, matplotlib plotting, basic ML (linear regression, classification), data cleaning, statistical analysis, list comprehensions, file handling, etc.`,
      dataAnalyst: `Generate a unique data analysis challenge. Provide a dataset description and ask the user to analyze it. Cover: finding trends, creating visualizations, statistical summaries, correlation analysis, outlier detection, comparing categories, time series patterns, etc. The user should describe their analysis approach and what charts/metrics they'd use.`,
    };

    const systemPrompt = `You are a tech skills challenge generator for a coding game platform. Generate ONE unique challenge.

${domainPrompts[domain] || domainPrompts.fullstack}

Difficulty level: ${difficulty || "Beginner"}

${previousIds?.length ? `Avoid these topics/IDs: ${previousIds.join(", ")}` : ""}

Return ONLY valid JSON with this structure:
{
  "id": "unique-id-string",
  "title": "Challenge Title (3-5 words)",
  "description": "Detailed challenge description with specific requirements",
  "difficulty": "${difficulty || "Beginner"}",
  "xpReward": ${difficulty === "Expert" ? 50 : difficulty === "Advanced" ? 40 : difficulty === "Intermediate" ? 30 : 20},
  "hints": ["hint 1", "hint 2"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a unique ${difficulty || "Beginner"} ${domain} challenge. Make it creative and different from common textbook examples.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    
    const challenge = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(challenge), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-challenge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
