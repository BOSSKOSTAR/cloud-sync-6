import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Promo from "./pages/Promo";
import Funnel from "./pages/Funnel";
import Vizitka from "./pages/Vizitka";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const isPrestart = localStorage.getItem("site_prestart") === "1";

// Сохраняем реф. код при заходе по реф. ссылке — чтобы не потерялся при переходах
const _urlRef = new URLSearchParams(window.location.search).get('ref');
if (_urlRef) localStorage.setItem('pending_ref', _urlRef);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {isPrestart ? (
              <>
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<ComingSoon />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/register" element={<Auth mode="register" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/promo" element={<Promo />} />
                <Route path="/voronka" element={<Funnel />} />
                <Route path="/vizitka" element={<Vizitka />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;