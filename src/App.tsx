import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Index from "./pages/Index";
import Repositories from "./pages/Repositories";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Incidents from "./pages/Incidents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App Routes (Dashboard) */}
          <Route path="/dashboard" element={<Index />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/settings" element={<Settings />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


