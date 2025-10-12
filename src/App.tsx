import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaign from "./pages/Campaign";
import Training from "./pages/Training";
import Dashboard from "./pages/Dashboard";
import DevXpSandbox from "./pages/DevXpSandbox";
import Profil from "./pages/Home";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Statistics from "./pages/Statistics";
import SessionSummary from '@/pages/SessionSummary'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/historique" element={<History />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:slug?" element={<Campaign />} />
          <Route path="/train/:questId" element={<Training />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dev-xp-sandbox" element={<DevXpSandbox />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/training/:questId/summary" element={<SessionSummary />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
