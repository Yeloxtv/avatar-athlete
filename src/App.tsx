import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TabBar from "@/components/layout/TabBar";
import Index from "./pages/Index";
import Campaign from "./pages/Campaign";
import Training from "./pages/Training";
import Dashboard from "./pages/Dashboard";
import DevXpSandbox from "./pages/DevXpSandbox";
import Home from "./pages/Home";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import SessionSummary from "@/pages/SessionSummary";
import SessionDetail from "@/pages/SessionDetail";

const queryClient = new QueryClient();

// Pages où la TabBar ne doit pas apparaître
const HIDDEN_TABBAR_PATTERNS = [/^\/train\//, /\/summary$/, /^\/statistics\/session\//];

function AppLayout() {
  const location = useLocation();
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dev-xp-sandbox" element={<DevXpSandbox />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/training/:questId/summary" element={<SessionSummary />} />
          <Route path="/statistics/session/:sessionId" element={<SessionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
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
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
