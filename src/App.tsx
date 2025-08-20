import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFormations from "./pages/admin/AdminFormations";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminHero from "./pages/admin/AdminHero";
import AdminCategories from "./pages/admin/AdminCategories";
import { AdminProfile } from "./pages/admin/AdminProfile";

const queryClient = new QueryClient();

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={
              <AuthenticatedRoute>
                <AdminLayout />
              </AuthenticatedRoute>
            }>
              <Route index element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="hero" element={
                <ProtectedRoute>
                  <AdminHero />
                </ProtectedRoute>
              } />
              <Route path="formations" element={
                <ProtectedRoute>
                  <AdminFormations />
                </ProtectedRoute>
              } />
              <Route path="blog" element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              <Route path="categories" element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              } />
              <Route path="testimonials" element={
                <ProtectedRoute>
                  <AdminTestimonials />
                </ProtectedRoute>
              } />
              <Route path="registrations" element={
                <ProtectedRoute>
                  <AdminRegistrations />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
