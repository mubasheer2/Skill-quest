import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { domain, challenge, submission } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const domainCriteria: Record<string, string> = {
      fullstack: `Evaluate this HTML/CSS/JS code submission. Check:
1. Does it match the challenge requirements? (layout, components, elements)
2. Code quality (semantic HTML, clean CSS, proper JS)
3. Styling (visual appeal, spacing, colors)
4. Responsiveness consideration
5. Functionality (interactive elements work correctly)`,
      sql: `Evaluate this SQL query. Check:
1. Does it correctly answer the challenge question?
2. Query syntax correctness
3. Proper use of SQL features (JOINs, GROUP BY, WHERE, etc.)
4. Query efficiency
5. Output would return expected results`,
      cyber: `Evaluate this cybersecurity answer. Check:
1. Did they correctly identify the vulnerability?
2. Is the fix/solution correct and complete?
3. Did they explain WHY it's vulnerable?
4. Did they use proper security practices (parameterized queries, encoding, hashing, etc.)
5. Are edge cases considered?`,
      python: `Evaluate this Python code. Check:
1. Does it solve the challenge correctly?
2. Code syntax and logic correctness
3. Proper use of libraries (numpy, pandas, matplotlib if applicable)
4. Code efficiency and Pythonic style
5. Would the output be correct?`,
      dataAnalyst: `Evaluate this data analysis response. Check:
1. Did they choose the right analysis approach?
2. Correct chart type selection
3. Proper metrics/statistics identified
4. Clear interpretation of results
5. Actionable insights provided`,
    };

    const systemPrompt = `You are an expert code evaluator for a tech skills game. Evaluate the user's submission for correctness and quality.

Challenge: "${challenge.title}"
Description: ${challenge.description}
Difficulty: ${challenge.difficulty}

${domainCriteria[domain] || domainCriteria.fullstack}

Return ONLY valid JSON:
{
  "score": <number 0-100>,
  "correct": <boolean>,
  "feedback": ["point 1", "point 2", ...],
  "suggestions": ["improvement 1", "improvement 2"]
}

Be fair but strict. An empty or trivially short submission should score 0. A partially correct one 30-60. A good one 60-85. An excellent one 85-100.`;

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
          { role: "user", content: `Evaluate this ${domain} submission:\n\n${submission}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
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
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    
    const evaluation = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-submission error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
