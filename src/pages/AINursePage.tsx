
import { useAuth } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { AINurse } from "@/components/AINurse";
import { Loader2 } from "lucide-react";

const AINursePage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading AI Nurse...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <AINurse />
      </div>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert AI Nurse. Caring for Nigerian mothers with advanced AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default AINursePage;
