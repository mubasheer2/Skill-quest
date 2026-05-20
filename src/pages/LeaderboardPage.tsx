import { Trophy, Medal, Award, User } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

const npcPlayers = [
  { name: "CyberNinja_42", score: 4850, level: 18 },
  { name: "CodeMaster_X", score: 4200, level: 16 },
  { name: "SQLWizard", score: 3900, level: 15 },
  { name: "FullStack_Pro", score: 3600, level: 14 },
  { name: "DataHunter", score: 3100, level: 12 },
  { name: "HackerElite", score: 2800, level: 11 },
  { name: "ByteRunner", score: 2500, level: 10 },
  { name: "QueryKing", score: 2200, level: 9 },
  { name: "PythonSnake", score: 1900, level: 8 },
  { name: "WebWarrior", score: 1600, level: 7 },
];

const rankIcons: Record<number, React.ReactNode> = {
  1: <Trophy className="h-5 w-5 text-neon-yellow" />,
  2: <Medal className="h-5 w-5 text-muted-foreground" />,
  3: <Award className="h-5 w-5 text-neon-orange" />,
};

export default function LeaderboardPage() {
  const { profile } = useGame();

  // Merge player into NPC list and sort
  const allPlayers = [
    { name: profile.username, score: profile.totalScore, level: profile.level, isPlayer: true },
    ...npcPlayers.map((p) => ({ ...p, isPlayer: false })),
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-5 sm:h-6 w-5 sm:w-6 text-neon-yellow" /> Global Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Top players across all domains</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 sm:px-4 text-xs font-medium text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-3 sm:px-4 text-xs font-medium text-muted-foreground">Player</th>
              <th className="text-right py-3 px-3 sm:px-4 text-xs font-medium text-muted-foreground">Level</th>
              <th className="text-right py-3 px-3 sm:px-4 text-xs font-medium text-muted-foreground">Score</th>
            </tr>
          </thead>
          <tbody>
            {allPlayers.map((p, idx) => {
              const rank = idx + 1;
              return (
                <tr
                  key={p.name}
                  className={`border-b border-border/50 transition-colors ${
                    p.isPlayer ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-secondary/30"
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      {rankIcons[rank] || <span className="text-sm text-muted-foreground w-5 text-center">{rank}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      {p.isPlayer && <User className="h-3.5 w-3.5 text-primary shrink-0" />}
                      <span className={p.isPlayer ? "text-primary font-bold" : "text-foreground"}>
                        {p.name} {p.isPlayer && "(You)"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right text-sm text-muted-foreground">Lv.{p.level}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-sm text-primary">{p.score.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
