import { useState, useCallback, useRef } from "react";
import { Play, Send, Lightbulb, RefreshCw, ChevronRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { fullStackChallenges, getRandomChallenge } from "@/data/challenges";
import { useAIChallenge } from "@/hooks/useAIChallenge";
import { toast } from "sonner";

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a2e;
      color: #eee;
    }
  </style>
</head>
<body>
  <h1>Start coding here!</h1>
</body>
</html>`;

export default function FullStackMode() {
  const { addXP, recordChallenge } = useGame();
  const { challenge, isGenerating, isEvaluating, evalResult, setEvalResult, generateChallenge, evaluateSubmission } = useAIChallenge("fullstack", fullStackChallenges, getRandomChallenge);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [preview, setPreview] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const runCode = useCallback(() => {
    setRunError(null);
    try {
      // Basic validation
      if (!code.trim()) {
        setRunError("Code is empty. Write some HTML/CSS/JS first.");
        return;
      }
      setPreview(code);
      toast.success("Code running in preview!");
    } catch (e: any) {
      setRunError(e.message || "Error running code");
    }
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_CODE);
    setPreview("");
    setRunError(null);
    setEvalResult(null);
    setSubmitted(false);
    toast.info("Code reset to default");
  }, [setEvalResult]);

  const submitCode = useCallback(async () => {
    if (submitted) {
      toast.info("Already submitted! Click 'New AI Challenge' for the next one.");
      return;
    }
    setRunError(null);
    const result = await evaluateSubmission(code);
    if (result) {
      setSubmitted(true);
      const xp = Math.round((result.score / 100) * challenge.xpReward);
      if (xp > 0) {
        addXP("fullstack", xp);
        toast.success(`+${xp} XP earned! Score: ${result.score}/100`);
      } else {
        toast.error(`Score: ${result.score}/100. Try harder next time!`);
      }
      recordChallenge(challenge.id);
      // Auto-generate next challenge after delay
      setTimeout(() => {
        generateChallenge(challenge.difficulty);
        setCode(DEFAULT_CODE);
        setPreview("");
        setShowHints(false);
        setSubmitted(false);
        setEvalResult(null);
      }, 5000);
    }
  }, [code, challenge, addXP, evaluateSubmission, submitted, recordChallenge, generateChallenge, setEvalResult]);

  const nextChallenge = () => {
    generateChallenge(challenge.difficulty);
    setCode(DEFAULT_CODE);
    setPreview("");
    setShowHints(false);
    setSubmitted(false);
    setEvalResult(null);
    setRunError(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-card/50 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
            {challenge.difficulty}
          </span>
          <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">{challenge.title}</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)} className="text-xs sm:text-sm">
            <Lightbulb className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Hints</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={nextChallenge} disabled={isGenerating} className="text-xs sm:text-sm">
            {isGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
            <span className="hidden sm:inline">New AI Challenge</span>
          </Button>
        </div>
      </div>

      {/* Challenge description */}
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

      {/* Editor + Preview */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-card/30 gap-1 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">index.html</span>
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" onClick={resetCode} className="text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" variant="outline" onClick={runCode} className="text-xs">
                <Play className="h-3.5 w-3.5 mr-1" /> Run
              </Button>
              <Button size="sm" onClick={submitCode} disabled={isEvaluating || submitted} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                {isEvaluating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                {submitted ? "Submitted ✓" : "Submit"}
              </Button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 resize-none bg-background p-3 sm:p-4 font-mono text-xs sm:text-sm text-foreground focus:outline-none scrollbar-thin leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Preview + Results */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[200px]">
          <div className="px-3 py-2 border-b border-border bg-card/30">
            <span className="text-xs font-mono text-muted-foreground">Live Preview</span>
          </div>
          <div className="flex-1 bg-foreground/5 relative">
            {preview ? (
              <iframe ref={iframeRef} srcDoc={preview} className="absolute inset-0 w-full h-full border-0" title="Preview" sandbox="allow-scripts" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Click "Run" to see your code
              </div>
            )}
          </div>

          {/* Errors */}
          {runError && (
            <div className="border-t border-destructive/30 p-3 bg-destructive/10 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{runError}</p>
            </div>
          )}

          {evalResult && (
            <div className="border-t border-border p-3 sm:p-4 bg-card/50 max-h-48 overflow-auto scrollbar-thin">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">AI Score</span>
                <span className={`text-2xl font-bold ${evalResult.score >= 70 ? "text-neon-green" : evalResult.score >= 40 ? "text-accent" : "text-destructive"}`}>
                  {evalResult.score}/100
                </span>
              </div>
              <div className="space-y-1">
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
              </div>
              {submitted && (
                <p className="text-xs text-muted-foreground mt-2 italic">Next challenge loading in 5s...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
