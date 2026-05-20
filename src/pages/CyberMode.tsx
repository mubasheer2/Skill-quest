import { useState, useCallback } from "react";
import { Shield, Send, Lightbulb, RefreshCw, ChevronRight, AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { cyberChallenges, getRandomChallenge } from "@/data/challenges";
import { useAIChallenge } from "@/hooks/useAIChallenge";
import { toast } from "sonner";

export default function CyberMode() {
  const { addXP, recordChallenge } = useGame();
  const { challenge, isGenerating, isEvaluating, evalResult, setEvalResult, generateChallenge, evaluateSubmission } = useAIChallenge("cyber", cyberChallenges, getRandomChallenge);
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        addXP("cyber", xp);
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

  const parts = challenge.description.split("```");

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-mono px-2 py-1 rounded bg-neon-pink/10 text-neon-pink border border-neon-pink/20 shrink-0">
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

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left: Challenge */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border min-w-0 overflow-auto scrollbar-thin min-h-[200px]">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-neon-pink">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-semibold">Vulnerability Analysis</span>
            </div>
            {parts.map((part, i) =>
              i % 2 === 0 ? (
                <p key={i} className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">{part.trim()}</p>
              ) : (
                <pre key={i} className="bg-background border border-border rounded-lg p-3 sm:p-4 text-xs font-mono text-foreground overflow-x-auto">
                  {part.replace(/^javascript\n?/, "")}
                </pre>
              )
            )}
            {showHints && challenge.hints && (
              <div className="space-y-1 pt-2">
                {challenge.hints.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-accent">
                    <ChevronRight className="h-3 w-3" /> {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Answer */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border bg-card/30 flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">Your Analysis & Fix</span>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={resetAnswer} className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" onClick={submitAnswer} disabled={isEvaluating || submitted} className="bg-neon-pink/90 text-primary-foreground hover:bg-neon-pink text-xs">
                {isEvaluating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {submitted ? "Submitted ✓" : "Submit"}
              </Button>
            </div>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 resize-none bg-background p-3 sm:p-4 font-mono text-xs sm:text-sm text-foreground focus:outline-none scrollbar-thin leading-relaxed"
            placeholder="Identify the vulnerability and write the fixed code here..."
            spellCheck={false}
          />

          {evalResult && (
            <div className="border-t border-border p-3 sm:p-4 bg-card/50 max-h-48 overflow-auto scrollbar-thin">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Security Score</span>
                <span className={`text-2xl font-bold ${evalResult.score >= 70 ? "text-neon-green" : evalResult.score >= 40 ? "text-accent" : "text-destructive"}`}>
                  {evalResult.score}/100
                </span>
              </div>
              {evalResult.feedback.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-neon-green shrink-0" /> {f}
                </div>
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
