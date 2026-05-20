import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Challenge } from "@/data/challenges";

interface EvalResult {
  score: number;
  correct: boolean;
  feedback: string[];
  suggestions: string[];
}

export function useAIChallenge(
  domain: string,
  fallbackChallenges: Challenge[],
  getRandomFallback: (list: Challenge[]) => Challenge
) {
  const [challenge, setChallenge] = useState<Challenge>(() => getRandomFallback(fallbackChallenges));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  const generateChallenge = useCallback(async (difficulty?: string) => {
    setIsGenerating(true);
    setEvalResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-challenge", {
        body: { domain, difficulty: difficulty || "Beginner", previousIds: usedIds },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      const newChallenge: Challenge = {
        id: data.id || `ai-${Date.now()}`,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty || "Beginner",
        xpReward: data.xpReward || 20,
        hints: data.hints || [],
      };
      setChallenge(newChallenge);
      setUsedIds((prev) => [...prev.slice(-20), newChallenge.id]);
      toast.success("New AI challenge generated!");
    } catch (e: any) {
      console.error("AI generation failed, using fallback:", e);
      // Fallback to local challenges
      const fallback = getRandomFallback(fallbackChallenges);
      setChallenge(fallback);
      toast.info("Using offline challenge");
    } finally {
      setIsGenerating(false);
    }
  }, [domain, usedIds, fallbackChallenges, getRandomFallback]);

  const evaluateSubmission = useCallback(async (submission: string): Promise<EvalResult | null> => {
    if (!submission.trim() || submission.trim().length < 5) {
      toast.error("Please write a more detailed answer before submitting.");
      return null;
    }
    setIsEvaluating(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-submission", {
        body: { domain, challenge, submission },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      const result: EvalResult = {
        score: data.score ?? 0,
        correct: data.correct ?? false,
        feedback: data.feedback || [],
        suggestions: data.suggestions || [],
      };
      setEvalResult(result);
      return result;
    } catch (e: any) {
      console.error("AI evaluation failed:", e);
      toast.error("Evaluation failed. Please try again.");
      return null;
    } finally {
      setIsEvaluating(false);
    }
  }, [domain, challenge]);

  return {
    challenge,
    isGenerating,
    isEvaluating,
    evalResult,
    setEvalResult,
    generateChallenge,
    evaluateSubmission,
  };
}
