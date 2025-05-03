import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import TravelPage from "@/pages/travel";
import { AppLayout } from "@/components/layout/AppLayout";
import { BalanceProvider } from "./contexts/BalanceContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/travel" component={TravelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <BalanceProvider>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </BalanceProvider>
  );
}

export default App;
