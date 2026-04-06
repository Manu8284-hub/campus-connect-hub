import { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>This can be only accessible to admin, not students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user?.email && (
                <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Please login with your official <span className="font-medium">@chitkara.edu.in</span> account to open the admin panel.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/logout" className="block">
                  <Button className="w-full">Logout</Button>
                </Link>
                <Link to="/" className="block">
                  <Button variant="outline" className="w-full">Go to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
