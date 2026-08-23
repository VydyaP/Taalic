import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollectionPage from "./pages/CollectionPage";
import DetailPage from "./pages/DetailPage";
import KeerthanaFormPage from "./pages/KeerthanaFormPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, ProtectedRoute } from "./auth/AuthProvider";
import { EditGateProvider, GateRoute } from "./gate/EditGateProvider";
import { SidebarLayout } from "./components/layout/SidebarLayout";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Firestore permission-denied errors are deterministic, not transient —
      // retrying just delays surfacing a real failure to the user.
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <EditGateProvider>
                      <SidebarLayout />
                    </EditGateProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<CollectionPage />} />
                <Route
                  path="add"
                  element={
                    <GateRoute action="add">
                      <KeerthanaFormPage />
                    </GateRoute>
                  }
                />
                <Route path="k/:id" element={<DetailPage />} />
                <Route
                  path="k/:id/edit"
                  element={
                    <GateRoute action="edit">
                      <KeerthanaFormPage />
                    </GateRoute>
                  }
                />
                <Route path="settings" element={<AccountPage />} />
              </Route>
              <Route path="/login" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
