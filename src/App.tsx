import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Index from "./pages/Index";
import Repositories from "./pages/Repositories";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Incidents from "./pages/Incidents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthCheck } from "./components/AuthCheck";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Check auth on app load */}
          <AuthCheck />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes - Require login */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Index /></ProtectedRoute>
            } />
            <Route path="/repositories" element={
              <ProtectedRoute><Repositories /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/incidents" element={
              <ProtectedRoute><Incidents /></ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute><AIInsights /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
