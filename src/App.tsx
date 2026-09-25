import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Portfolio } from "./pages/Portfolio";
import { LegalPage } from "./pages/LegalPage";
import { Playground } from "./pages/Playground";
import { CaseStudy } from "./pages/CaseStudy";
import { privacyPolicy, termsOfUse } from "./content/legal";

// A malformed escape (a hand-typed or truncated "#%") makes decodeURIComponent
// throw, and a throw inside the effect would unmount the whole app
function sectionFromHash(hash: string) {
  if (!hash) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

// <BrowserRouter> does not reset scroll on navigation (only the data-router
// <ScrollRestoration> does), so a route change inherits the previous page's
// scroll offset. A #section arriving with the route (a deep link, or the old
// /portfolio#section redirect) opens there instead: the page renders after the
// browser's own jump to the anchor, so that jump finds nothing. Keyed on
// pathname only, so in-page #hash links are left to the browser.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const section = sectionFromHash(window.location.hash);
    if (section) section.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// The portfolio lived at /portfolio before it moved to the root. Vercel
// answers that address with a 301 (vercel.json); this covers client-side
// navigation and the dev server, and keeps any query string and #section.
function MovedToRoot() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/portfolio" element={<MovedToRoot />} />
        <Route path="/mosher-web-dev" element={<Landing />} />
        <Route path="/case-study/:slug" element={<CaseStudy />} />
        <Route path="/privacy" element={<LegalPage doc={privacyPolicy} />} />
        <Route path="/terms" element={<LegalPage doc={termsOfUse} />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
