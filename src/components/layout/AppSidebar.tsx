import { Link, useLocation } from "react-router-dom";
import {
  Code2,
  Database,
  BarChart3,
  Shield,
  Brain,
  Trophy,
  User,
  Gamepad2,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Progress } from "@/components/ui/progress";

const domains = [
  { name: "Dashboard", path: "/", icon: Gamepad2, color: "text-primary" },
  { name: "Full Stack", path: "/fullstack", icon: Code2, color: "text-neon-cyan" },
  { name: "SQL", path: "/sql", icon: Database, color: "text-neon-green" },
  { name: "Data Analyst", path: "/data-analyst", icon: BarChart3, color: "text-neon-orange" },
  { name: "Python / ML", path: "/python", icon: Brain, color: "text-accent" },
  { name: "Cyber Security", path: "/cyber", icon: Shield, color: "text-neon-pink" },
];

const bottomLinks = [
  { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { name: "Profile", path: "/profile", icon: User },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export default function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { profile } = useGame();
  const xpPercent = (profile.xp / profile.xpToNext) * 100;

  return (
    <aside
      className={`flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <Zap className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && (
          <span className="font-bold text-lg text-foreground neon-text tracking-tight">
            SkillForge
          </span>
        )}
      </div>

      {/* XP Bar */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Lv.{profile.level} {profile.rank}</span>
            <span>{profile.xp}/{profile.xpToNext} XP</span>
          </div>
          <Progress value={xpPercent} className="h-1.5" />
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 py-3 space-y-1 px-2 overflow-y-auto scrollbar-thin">
        {domains.map((d) => {
          const active = location.pathname === d.path;
          return (
            <Link
              key={d.path}
              to={d.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-secondary text-foreground neon-glow"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <d.icon className={`h-5 w-5 shrink-0 ${active ? d.color : ""}`} />
              {!collapsed && <span>{d.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-3 px-2 space-y-1">
        {bottomLinks.map((d) => {
          const active = location.pathname === d.path;
          return (
            <Link
              key={d.path}
              to={d.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <d.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{d.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle - hidden on mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center py-3 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
