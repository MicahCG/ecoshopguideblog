import { Switch, Route, Redirect as WouterRedirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import AboutUs from "@/pages/AboutUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/not-found";
import NewsletterPopup from "@/components/NewsletterPopup";

const BlogRedirect = () => <WouterRedirect to="/blog" />;

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/pages/about" component={AboutUs} />
      <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pages/terms-of-service" component={TermsOfService} />

      {/* Legacy redirects */}
      <Route path="/shop" component={BlogRedirect} />
      <Route path="/shop/:rest*" component={BlogRedirect} />
      <Route path="/products" component={BlogRedirect} />
      <Route path="/products/:rest*" component={BlogRedirect} />
      <Route path="/collections" component={BlogRedirect} />
      <Route path="/collections/:rest*" component={BlogRedirect} />
      <Route path="/wellness" component={BlogRedirect} />
      <Route path="/wellness/:rest*" component={BlogRedirect} />
      <Route path="/bedroom" component={BlogRedirect} />
      <Route path="/bedroom/:rest*" component={BlogRedirect} />
      <Route path="/category" component={BlogRedirect} />
      <Route path="/category/:rest*" component={BlogRedirect} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleAnalytics />
        <ScrollToTop />
        <Toaster />
        <Router />
        <NewsletterPopup />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
