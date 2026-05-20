import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  rank: string;
  domains: {
    fullstack: { level: number; xp: number; challenges: number };
    sql: { level: number; xp: number; challenges: number };
    dataAnalyst: { level: number; xp: number; challenges: number };
    python: { level: number; xp: number; challenges: number };
    cyber: { level: number; xp: number; challenges: number };
  };
  badges: string[];
  totalScore: number;
  challengeHistory: string[]; // track completed challenge IDs to prevent repeats
}

const defaultProfile: PlayerProfile = {
  username: "Player_01",
  level: 1,
  xp: 0,
  xpToNext: 100,
  rank: "Rookie",
  domains: {
    fullstack: { level: 1, xp: 0, challenges: 0 },
    sql: { level: 1, xp: 0, challenges: 0 },
    dataAnalyst: { level: 1, xp: 0, challenges: 0 },
    python: { level: 1, xp: 0, challenges: 0 },
    cyber: { level: 1, xp: 0, challenges: 0 },
  },
  badges: [],
  totalScore: 0,
  challengeHistory: [],
};

interface GameContextType {
  profile: PlayerProfile;
  addXP: (domain: keyof PlayerProfile["domains"], amount: number) => void;
  addScore: (amount: number) => void;
  recordChallenge: (challengeId: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

const getRank = (level: number) => {
  if (level >= 20) return "Legend";
  if (level >= 15) return "Expert";
  if (level >= 10) return "Advanced";
  if (level >= 5) return "Intermediate";
  return "Rookie";
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem("gameProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultProfile, ...parsed, domains: { ...defaultProfile.domains, ...parsed.domains } };
    }
    return defaultProfile;
  });

  const persist = useCallback((updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile((prev) => {
      const updated = updater(prev);
      localStorage.setItem("gameProfile", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addXP = useCallback((domain: keyof PlayerProfile["domains"], amount: number) => {
    persist((prev) => {
      const d = { ...prev.domains[domain] };
      d.xp += amount;
      d.challenges += 1;
      if (d.xp >= 100 * d.level) {
        d.xp -= 100 * d.level;
        d.level += 1;
      }

      let totalXP = prev.xp + amount;
      let lvl = prev.level;
      let xpToNext = prev.xpToNext;
      if (totalXP >= xpToNext) {
        totalXP -= xpToNext;
        lvl += 1;
        xpToNext = 100 * lvl;
      }

      return {
        ...prev,
        level: lvl,
        xp: totalXP,
        xpToNext,
        rank: getRank(lvl),
        domains: { ...prev.domains, [domain]: d },
        totalScore: prev.totalScore + amount,
      };
    });
  }, [persist]);

  const addScore = useCallback((amount: number) => {
    persist((prev) => ({ ...prev, totalScore: prev.totalScore + amount }));
  }, [persist]);

  const recordChallenge = useCallback((challengeId: string) => {
    persist((prev) => ({
      ...prev,
      challengeHistory: [...prev.challengeHistory.slice(-50), challengeId],
    }));
  }, [persist]);

  return (
    <GameContext.Provider value={{ profile, addXP, addScore, recordChallenge }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
