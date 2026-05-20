import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import FullStackMode from "@/pages/FullStackMode";
import SQLMode from "@/pages/SQLMode";
import CyberMode from "@/pages/CyberMode";
import PythonMode from "@/pages/PythonMode";
import DataAnalystMode from "@/pages/DataAnalystMode";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// SkillForge Arena App
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
       <BrowserRouter basename="/DevConnect/skill-quest">
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/fullstack" element={<FullStackMode />} />
              <Route path="/sql" element={<SQLMode />} />
              <Route path="/cyber" element={<CyberMode />} />
              <Route path="/data-analyst" element={<DataAnalystMode />} />
              <Route path="/python" element={<PythonMode />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
