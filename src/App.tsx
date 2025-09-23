
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Install from "./pages/Install";
import Docs from "./pages/Docs";
import DocContent from "./pages/DocContent";
import Playground from "./pages/Playground";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isPlayground = location.pathname === '/play';

  return (
    <div className="min-h-screen bg-charcoal-950">
      {!isPlayground && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/install" element={<Install />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:section" element={<DocContent />} />
        <Route path="/play" element={<Playground />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  console.log('App component is rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
