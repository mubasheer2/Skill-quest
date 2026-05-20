import { useState, useCallback } from "react";
import { BarChart3, Send, Lightbulb, RefreshCw, ChevronRight, Loader2, Sparkles, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { dataAnalystChallenges, getRandomChallenge } from "@/data/challenges";
import { useAIChallenge } from "@/hooks/useAIChallenge";
import { toast } from "sonner";

const sampleDatasets = {
  sales: {
    columns: ["month", "electronics", "clothing", "food"],
    rows: [
      ["Jan", 12000, 8500, 6200],
      ["Feb", 11500, 9200, 5800],
      ["Mar", 13200, 7800, 6500],
      ["Apr", 14100, 8900, 7100],
      ["May", 15000, 9500, 6800],
      ["Jun", 13800, 10200, 7400],
    ],
  },
  customers: {
    columns: ["customer_id", "purchase_freq", "avg_order", "total_spent", "days_since_last"],
    rows: [
      [1, 12, 85.50, 1026, 5],
      [2, 3, 210.00, 630, 45],
      [3, 8, 45.00, 360, 12],
      [4, 1, 500.00, 500, 90],
      [5, 15, 32.00, 480, 2],
      [6, 6, 120.00, 720, 20],
    ],
  },
};

export default function DataAnalystMode() {
  const { addXP, recordChallenge } = useGame();
  const { challenge, isGenerating, isEvaluating, evalResult, setEvalResult, generateChallenge, evaluateSubmission } = useAIChallenge("dataAnalyst", dataAnalystChallenges, getRandomChallenge);
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [activeDataset, setActiveDataset] = useState<keyof typeof sampleDatasets>("sales");
  const [submitted, setSubmitted] = useState(false);

  const datasetData = sampleDatasets[activeDataset];

  const resetAnswer = useCallback(() => {
    setAnswer("");
    setEvalResult(null);
    setSubmitted(false);
    toast.info("Answer cleared");
  }, [setEvalResult]);

  const submitAnswer = useCallback(async () => {
    if (submitted) {
      toast.info("Already submitted! Click 'New AI Challenge' for the next one.");
      return;
    }
    const result = await evaluateSubmission(answer);
    if (result) {
      setSubmitted(true);
      const xp = Math.round((result.score / 100) * challenge.xpReward);
      if (xp > 0) {
        addXP("dataAnalyst", xp);
        toast.success(`+${xp} XP earned! Score: ${result.score}/100`);
      } else {
        toast.error(`Score: ${result.score}/100. Keep practicing!`);
      }
      recordChallenge(challenge.id);
      setTimeout(() => {
        generateChallenge(challenge.difficulty);
        setAnswer("");
        setShowHints(false);
        setSubmitted(false);
        setEvalResult(null);
      }, 5000);
    }
  }, [answer, challenge, addXP, evaluateSubmission, submitted, recordChallenge, generateChallenge, setEvalResult]);

  const nextChallenge = () => {
    generateChallenge(challenge.difficulty);
    setAnswer("");
    setShowHints(false);
    setSubmitted(false);
    setEvalResult(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-mono px-2 py-1 rounded bg-neon-orange/10 text-neon-orange border border-neon-orange/20 shrink-0">
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

      {/* Challenge description */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-4 w-4 text-neon-orange" />
          <span className="text-xs font-semibold text-neon-orange">Data Analysis Challenge</span>
        </div>
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
        {/* Left: Dataset + Answer */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border min-w-0 min-h-[250px]">
          {/* Dataset tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card/30 overflow-x-auto">
            <BarChart3 className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
            {Object.keys(sampleDatasets).map((t) => (
              <button
                key={t}
                onClick={() => setActiveDataset(t as keyof typeof sampleDatasets)}
                className={`px-2.5 py-1 text-xs rounded font-mono transition-colors shrink-0 ${
                  activeDataset === t ? "bg-neon-orange/10 text-neon-orange border border-neon-orange/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Dataset table */}
          <div className="max-h-40 overflow-auto scrollbar-thin border-b border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {datasetData.columns.map((col) => (
                    <th key={col} className="text-left py-2 px-2 sm:px-3 text-xs font-mono text-neon-orange">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasetData.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    {row.map((cell, j) => (
                      <td key={j} className="py-1.5 px-2 sm:px-3 text-xs font-mono text-muted-foreground">{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Answer area */}
          <div className="px-3 py-2 border-b border-border bg-card/30 flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Your Analysis</span>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={resetAnswer} className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" onClick={submitAnswer} disabled={isEvaluating || submitted} className="bg-neon-orange/90 text-primary-foreground hover:bg-neon-orange text-xs">
                {isEvaluating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {submitted ? "Submitted ✓" : "Submit"}
              </Button>
            </div>
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 resize-none bg-background p-3 sm:p-4 font-mono text-xs sm:text-sm text-foreground focus:outline-none scrollbar-thin leading-relaxed"
            placeholder="Describe your analysis approach, chart selections, metrics, and insights..."
            spellCheck={false}
          />
        </div>

        {/* Right: Results */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border bg-card/30">
            <span className="text-xs font-mono text-muted-foreground">AI Evaluation</span>
          </div>
          <div className="flex-1 p-4 overflow-auto scrollbar-thin">
            {isEvaluating ? (
              <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">AI is reviewing your analysis...</span>
              </div>
            ) : evalResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Score</span>
                  <span className={`text-3xl font-bold ${evalResult.score >= 70 ? "text-neon-green" : evalResult.score >= 40 ? "text-accent" : "text-destructive"}`}>
                    {evalResult.score}/100
                  </span>
                </div>
                <div className="space-y-1">
                  {evalResult.feedback.map((f, i) => (
                    <p key={i} className="text-xs text-muted-foreground">✓ {f}</p>
                  ))}
                </div>
                {evalResult.suggestions?.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-accent mb-1">Suggestions:</p>
                    {evalResult.suggestions.map((s, i) => (
                      <p key={i} className="text-xs text-muted-foreground">→ {s}</p>
                    ))}
                  </div>
                )}
                {submitted && <p className="text-xs text-muted-foreground mt-2 italic">Next challenge loading in 5s...</p>}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Submit your analysis to get AI feedback
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
