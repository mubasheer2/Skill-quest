import { useState, useCallback } from "react";
import { Brain, Send, Lightbulb, RefreshCw, ChevronRight, Loader2, Sparkles, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { pythonChallenges, getRandomChallenge } from "@/data/challenges";
import { useAIChallenge } from "@/hooks/useAIChallenge";
import { toast } from "sonner";

const DEFAULT_CODE = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Write your Python code here
`;

export default function PythonMode() {
  const { addXP, recordChallenge } = useGame();
  const { challenge, isGenerating, isEvaluating, evalResult, setEvalResult, generateChallenge, evaluateSubmission } = useAIChallenge("python", pythonChallenges, getRandomChallenge);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_CODE);
    setEvalResult(null);
    setSubmitted(false);
    toast.info("Code reset to default");
  }, [setEvalResult]);

  const submitCode = useCallback(async () => {
    if (submitted) {
      toast.info("Already submitted! Click 'New AI Challenge' for the next one.");
      return;
    }
    const result = await evaluateSubmission(code);
    if (result) {
      setSubmitted(true);
      const xp = Math.round((result.score / 100) * challenge.xpReward);
      if (xp > 0) {
        addXP("python", xp);
        toast.success(`+${xp} XP earned! Score: ${result.score}/100`);
      } else {
        toast.error(`Score: ${result.score}/100. Keep practicing!`);
      }
      recordChallenge(challenge.id);
      setTimeout(() => {
        generateChallenge(challenge.difficulty);
        setCode(DEFAULT_CODE);
        setShowHints(false);
        setSubmitted(false);
        setEvalResult(null);
      }, 5000);
    }
  }, [code, challenge, addXP, evaluateSubmission, submitted, recordChallenge, generateChallenge, setEvalResult]);

  const nextChallenge = () => {
    generateChallenge(challenge.difficulty);
    setCode(DEFAULT_CODE);
    setShowHints(false);
    setSubmitted(false);
    setEvalResult(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-mono px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">
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
          <Brain className="h-4 w-4 text-accent" />
          <span className="text-xs font-semibold text-accent">Python / ML Challenge</span>
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

      {/* Editor + Results */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border min-w-0 min-h-[250px]">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-card/30 gap-1 flex-wrap">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">solution.py</span>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={resetCode} className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" onClick={submitCode} disabled={isEvaluating || submitted} className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                {isEvaluating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {submitted ? "Submitted ✓" : "Submit"}
              </Button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 resize-none bg-background p-3 sm:p-4 font-mono text-xs sm:text-sm text-foreground focus:outline-none scrollbar-thin leading-relaxed"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        </div>

        {/* Results panel */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border bg-card/30">
            <span className="text-xs font-mono text-muted-foreground">AI Evaluation</span>
          </div>
          <div className="flex-1 p-4 overflow-auto scrollbar-thin">
            {isEvaluating ? (
              <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">AI is reviewing your code...</span>
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
                Submit your code to get AI feedback
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
