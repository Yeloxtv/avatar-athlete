import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import LiveWorkoutBar from "@/components/layout/LiveWorkoutBar";
import { WorkoutSessionProvider } from "@/contexts/WorkoutSessionContext";
import Campaign from "./pages/Campaign";
import Training from "./pages/Training";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import SessionSummary from "@/pages/SessionSummary";
import SessionDetail from "@/pages/SessionDetail";
import Exercises from "@/pages/Exercises";
import MyProgram from "@/pages/MyProgram";
import Progress from "@/pages/Progress";
import Auth from "./pages/Auth";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const queryClient = new QueryClient();

const HIDDEN_TABBAR_PATTERNS = [/^\/train\//, /\/summary$/, /^\/statistics\/session\//, /^\/auth/, /^\/my-program/];

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">⚙️</div>
          <p className="text-muted-foreground">Chargement de ton aventure...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  // Show onboarding once if user hasn't chosen their mode yet
  if (profile && profile.user_mode === null) {
    return <Onboarding />;
  }

  const showTabBar = !HIDDEN_TABBAR_PATTERNS.some(p => p.test(location.pathname));

  return (
    <>
      <div className={showTabBar ? 'pb-16' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Home />} />
          <Route path="/historique" element={<History />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:slug?" element={<Campaign />} />
          <Route path="/train/:questId" element={<Training />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/training/:questId/summary" element={<SessionSummary />} />
          <Route path="/statistics/session/:sessionId" element={<SessionDetail />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/my-program" element={<MyProgram />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showTabBar && <LiveWorkoutBar />}
      {showTabBar && <TabBar />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WorkoutSessionProvider>
          <ProtectedLayout />
        </WorkoutSessionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
