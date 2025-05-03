import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import { AppLayout } from "@/components/layout/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </>
  );
}

export default App;
