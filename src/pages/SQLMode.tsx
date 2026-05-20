import { useState, useCallback } from "react";
import { Play, Send, Lightbulb, RefreshCw, ChevronRight, Table2, FileCode, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { sqlChallenges, getRandomChallenge } from "@/data/challenges";
import { useAIChallenge } from "@/hooks/useAIChallenge";
import { toast } from "sonner";

const sampleTables = {
  orders: {
    columns: ["id", "customer_name", "order_amount", "order_date"],
    rows: [
      [1, "Alice Johnson", 250.0, "2024-01-15"],
      [2, "Bob Smith", 180.5, "2024-01-20"],
      [3, "Alice Johnson", 320.0, "2024-02-01"],
      [4, "Carol White", 95.0, "2024-02-10"],
      [5, "David Brown", 410.0, "2024-02-15"],
      [6, "Eve Davis", 150.0, "2024-03-01"],
      [7, "Bob Smith", 275.0, "2024-03-10"],
      [8, "David Brown", 190.0, "2024-03-15"],
    ],
  },
  employees: {
    columns: ["id", "name", "department", "salary"],
    rows: [
      [1, "John Doe", "Engineering", 85000],
      [2, "Jane Smith", "Marketing", 72000],
      [3, "Mike Wilson", "Engineering", 92000],
      [4, "Sara Lee", "Design", 68000],
      [5, "Tom Brown", "Marketing", 76000],
      [6, "Lisa Chen", "Engineering", 95000],
    ],
  },
  products: {
    columns: ["id", "name", "price", "category"],
    rows: [
      [1, "Laptop Pro", 1299.99, "Electronics"],
      [2, "Wireless Mouse", 29.99, "Accessories"],
      [3, "USB-C Hub", 49.99, "Accessories"],
      [4, 'Monitor 27"', 399.99, "Electronics"],
      [5, "Keyboard RGB", 89.99, "Accessories"],
    ],
  },
};

export default function SQLMode() {
  const { addXP, recordChallenge } = useGame();
  const { challenge, isGenerating, isEvaluating, evalResult, setEvalResult, generateChallenge, evaluateSubmission } = useAIChallenge("sql", sqlChallenges, getRandomChallenge);
  const [query, setQuery] = useState("SELECT * FROM orders LIMIT 5;");
  const [activeTable, setActiveTable] = useState<keyof typeof sampleTables>("orders");
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const tableData = sampleTables[activeTable];

  const runQuery = useCallback(() => {
    setRunError(null);
    setRunOutput(null);
    if (!query.trim()) {
      setRunError("Query is empty. Write a SQL query first.");
      return;
    }
    // Basic SQL syntax check
    const q = query.trim().toUpperCase();
    if (!q.startsWith("SELECT") && !q.startsWith("WITH")) {
      setRunError("Only SELECT/WITH queries are supported in this sandbox.");
      return;
    }
    setRunOutput(`Query parsed successfully. Submit to get AI evaluation.`);
    toast.success("Query looks valid!");
  }, [query]);

  const resetQuery = useCallback(() => {
    setQuery("");
    setRunOutput(null);
    setRunError(null);
    setEvalResult(null);
    setSubmitted(false);
    toast.info("Query cleared");
  }, [setEvalResult]);

  const submitQuery = useCallback(async () => {
    if (submitted) {
      toast.info("Already submitted! Click 'New AI Challenge' for the next one.");
      return;
    }
    setRunError(null);
    const result = await evaluateSubmission(query);
    if (result) {
      setSubmitted(true);
      const xp = Math.round((result.score / 100) * challenge.xpReward);
      if (xp > 0) {
        addXP("sql", xp);
        toast.success(`+${xp} XP earned! Score: ${result.score}/100`);
      } else {
        toast.error(`Score: ${result.score}/100. Keep practicing!`);
      }
      recordChallenge(challenge.id);
      setTimeout(() => {
        generateChallenge(challenge.difficulty);
        setQuery("");
        setShowHints(false);
        setSubmitted(false);
        setEvalResult(null);
        setRunOutput(null);
      }, 5000);
    }
  }, [query, challenge, addXP, evaluateSubmission, submitted, recordChallenge, generateChallenge, setEvalResult]);

  const nextChallenge = () => {
    generateChallenge(challenge.difficulty);
    setQuery("");
    setShowHints(false);
    setSubmitted(false);
    setEvalResult(null);
    setRunOutput(null);
    setRunError(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-mono px-2 py-1 rounded bg-neon-green/10 text-neon-green border border-neon-green/20 shrink-0">
            {challenge.difficulty}
          </span>
          <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">{challenge.title}</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)} className="text-xs">
            <Lightbulb className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Hints</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={nextChallenge} disabled={isGenerating} className="text-xs">
            {isGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
            <span className="hidden sm:inline">New AI Challenge</span>
          </Button>
        </div>
      </div>

      {/* Challenge */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-secondary/30">
        <p className="text-xs sm:text-sm text-muted-foreground">{challenge.description}</p>
        {showHints && challenge.hints && (
          <div className="mt-2 space-y-1">
            {challenge.hints.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-accent">
                <ChevronRight className="h-3 w-3" /> {h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left: Schema + Editor */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border min-w-0 min-h-[200px]">
          {/* Table tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card/30 overflow-x-auto">
            <Table2 className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
            {Object.keys(sampleTables).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTable(t as keyof typeof sampleTables)}
                className={`px-2.5 py-1 text-xs rounded font-mono transition-colors shrink-0 ${
                  activeTable === t ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* SQL Editor */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/30 gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">query.sql</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" onClick={resetQuery} className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" variant="outline" onClick={runQuery} className="text-xs">
                <Play className="h-3.5 w-3.5 mr-1" /> Run
              </Button>
              <Button size="sm" onClick={submitQuery} disabled={isEvaluating || submitted} className="bg-neon-green/90 text-primary-foreground hover:bg-neon-green text-xs">
                {isEvaluating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {submitted ? "Submitted ✓" : "Submit"}
              </Button>
            </div>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 resize-none bg-background p-3 sm:p-4 font-mono text-xs sm:text-sm text-foreground focus:outline-none scrollbar-thin leading-relaxed"
            placeholder="Write your SQL query here..."
            spellCheck={false}
          />
          {runError && (
            <div className="border-t border-destructive/30 p-3 bg-destructive/10 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{runError}</p>
            </div>
          )}
          {runOutput && !runError && (
            <div className="border-t border-neon-green/20 p-3 bg-neon-green/5">
              <p className="text-xs text-neon-green">{runOutput}</p>
            </div>
          )}
        </div>

        {/* Right: Table view + Results */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border bg-card/30">
            <span className="text-xs font-mono text-muted-foreground">Table: {activeTable}</span>
          </div>
          <div className="flex-1 overflow-auto scrollbar-thin p-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {tableData.columns.map((col) => (
                    <th key={col} className="text-left py-2 px-2 sm:px-3 text-xs font-mono text-neon-green">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    {row.map((cell, j) => (
                      <td key={j} className="py-1.5 px-2 sm:px-3 text-xs font-mono text-muted-foreground">{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {evalResult && (
            <div className="border-t border-border p-3 sm:p-4 bg-card/50 max-h-48 overflow-auto scrollbar-thin">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">AI Score</span>
                <span className={`text-2xl font-bold ${evalResult.score >= 70 ? "text-neon-green" : evalResult.score >= 40 ? "text-accent" : "text-destructive"}`}>
                  {evalResult.score}/100
                </span>
              </div>
              {evalResult.feedback.map((f, i) => (
                <p key={i} className="text-xs text-muted-foreground">✓ {f}</p>
              ))}
              {evalResult.suggestions?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-accent mb-1">Suggestions:</p>
                  {evalResult.suggestions.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground">→ {s}</p>
                  ))}
                </div>
              )}
              {submitted && <p className="text-xs text-muted-foreground mt-2 italic">Next challenge loading in 5s...</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
