import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Portfolio } from "./pages/Portfolio";
import { LegalPage } from "./pages/LegalPage";
import { privacyPolicy, termsOfUse } from "./content/legal";

// <BrowserRouter> does not reset scroll on navigation (only the data-router
// <ScrollRestoration> does), so a route change inherits the previous page's
// scroll offset. Keyed on pathname only, so in-page #hash links are unaffected.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/privacy" element={<LegalPage doc={privacyPolicy} />} />
        <Route path="/terms" element={<LegalPage doc={termsOfUse} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
