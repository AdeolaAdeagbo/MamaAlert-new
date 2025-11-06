
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OfflineNotice } from "@/components/OfflineNotice";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ModeProvider } from "./contexts/ModeContext";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EmergencyContacts from "./pages/EmergencyContacts";
import SymptomLogger from "./pages/SymptomLogger";
import SymptomGuide from "./pages/SymptomGuide";
import HealthcareCenters from "./pages/HealthcareCenters";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import PregnancyDetails from "./pages/PregnancyDetails";
import PostpartumCare from "./pages/PostpartumCare";
import AINursePage from "./pages/AINursePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="mamaalert-theme">
      <AuthProvider>
        <ModeProvider>
          <TooltipProvider>
          <OfflineNotice />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/home" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pregnancy-details" element={<PregnancyDetails />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              <Route path="/symptom-logger" element={<SymptomLogger />} />
              <Route path="/symptom-guide" element={<SymptomGuide />} />
              <Route path="/healthcare-centers" element={<HealthcareCenters />} />
              <Route path="/postpartum-care" element={<PostpartumCare />} />
              <Route path="/ai-nurse" element={<AINursePage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </ModeProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
