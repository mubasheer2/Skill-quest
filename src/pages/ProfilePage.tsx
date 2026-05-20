import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target, Code2, Database, BarChart3, Shield, Brain, Star } from "lucide-react";

const domainInfo = [
  { key: "fullstack" as const, name: "Full Stack", icon: Code2, color: "text-neon-cyan" },
  { key: "sql" as const, name: "SQL", icon: Database, color: "text-neon-green" },
  { key: "dataAnalyst" as const, name: "Data Analyst", icon: BarChart3, color: "text-neon-orange" },
  { key: "cyber" as const, name: "Cyber Security", icon: Shield, color: "text-neon-pink" },
  { key: "python" as const, name: "Python / ML", icon: Brain, color: "text-accent" },
];

export default function ProfilePage() {
  const { profile } = useGame();
  const xpPercent = (profile.xp / profile.xpToNext) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-4">
            <Star className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
          <p className="text-muted-foreground">{profile.rank} · Level {profile.level}</p>

          <div className="max-w-xs mx-auto mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level {profile.level}</span>
              <span>{profile.xp}/{profile.xpToNext} XP</span>
            </div>
            <Progress value={xpPercent} className="h-2" />
          </div>

          <div className="flex justify-center gap-8 mt-6">
            <div className="text-center">
              <Trophy className="h-5 w-5 mx-auto text-neon-yellow mb-1" />
              <div className="text-lg font-bold text-foreground">{profile.totalScore}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <Zap className="h-5 w-5 mx-auto text-neon-green mb-1" />
              <div className="text-lg font-bold text-foreground">{profile.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <Target className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-lg font-bold text-foreground">
                {Object.values(profile.domains).reduce((a, d) => a + d.challenges, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Progress */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Domain Progress</h2>
        <div className="space-y-3">
          {domainInfo.map((d) => {
            const data = profile.domains[d.key];
            const pct = Math.min((data.xp / (data.level * 100)) * 100, 100);
            return (
              <div key={d.key} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <d.icon className={`h-6 w-6 shrink-0 ${d.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{d.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Lv.{data.level} · {data.challenges} solved
                    </span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
