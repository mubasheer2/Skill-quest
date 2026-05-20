import { Link } from "react-router-dom";
import {
  Code2,
  Database,
  BarChart3,
  Shield,
  Brain,
  Zap,
  Trophy,
  Target,
  Flame,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";

const domainCards = [
  {
    name: "Full Stack Dev",
    desc: "Build UIs from AI-generated challenges",
    icon: Code2,
    path: "/fullstack",
    color: "from-[hsl(185,80%,55%)] to-[hsl(200,80%,45%)]",
    glowClass: "neon-glow",
    domainKey: "fullstack" as const,
  },
  {
    name: "SQL Developer",
    desc: "Query databases & solve data puzzles",
    icon: Database,
    path: "/sql",
    color: "from-[hsl(145,70%,50%)] to-[hsl(160,70%,40%)]",
    glowClass: "glow-green",
    domainKey: "sql" as const,
  },
  {
    name: "Data Analyst",
    desc: "Charts, analysis & data interpretation",
    icon: BarChart3,
    path: "/data-analyst",
    color: "from-[hsl(25,90%,58%)] to-[hsl(15,90%,48%)]",
    glowClass: "",
    domainKey: "dataAnalyst" as const,
  },
  {
    name: "Cyber Security",
    desc: "Find vulnerabilities & fix insecure code",
    icon: Shield,
    path: "/cyber",
    color: "from-[hsl(330,80%,60%)] to-[hsl(350,80%,50%)]",
    glowClass: "",
    domainKey: "cyber" as const,
  },
  {
    name: "Python / ML",
    desc: "Python, numpy, pandas & ML basics",
    icon: Brain,
    path: "/python",
    color: "from-[hsl(270,60%,60%)] to-[hsl(280,60%,50%)]",
    glowClass: "glow-purple",
    domainKey: "python" as const,
  },
];

export default function Dashboard() {
  const { profile } = useGame();
  const xpPercent = (profile.xp / profile.xpToNext) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-primary animate-pulse-glow rounded-full" />
            <h1 className="text-3xl font-bold text-foreground neon-text">
              SkillForge Arena
            </h1>
          </div>
          <p className="text-muted-foreground max-w-lg">
            Master tech skills through AI-powered challenges. Code, query, analyze, and compete.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatBox icon={<Target className="h-5 w-5 text-primary" />} label="Level" value={profile.level} />
            <StatBox icon={<Flame className="h-5 w-5 text-neon-orange" />} label="Total XP" value={profile.xp} />
            <StatBox icon={<Trophy className="h-5 w-5 text-neon-yellow" />} label="Score" value={profile.totalScore} />
            <StatBox icon={<Zap className="h-5 w-5 text-neon-green" />} label="Rank" value={profile.rank} />
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level {profile.level} → {profile.level + 1}</span>
              <span>{profile.xp} / {profile.xpToNext} XP</span>
            </div>
            <Progress value={xpPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Choose Your Arena</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainCards.map((d) => {
            const domainData = profile.domains[d.domainKey];
            return (
              <Link
                key={d.path}
                to={d.path}
                className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${d.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${d.color} mb-3`}>
                    <d.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{d.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{d.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Lv.{domainData.level}</span>
                    <span>•</span>
                    <span>{domainData.challenges} solved</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="glass-card rounded-lg p-3 flex items-center gap-3">
      {icon}
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-foreground">{String(value)}</div>
      </div>
    </div>
  );
}
