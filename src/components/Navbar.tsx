
import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-rose-600">MamaAlert</h1>
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/symptom-logger" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Log Symptoms
              </Link>
              <Link to="/symptom-guide" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Symptom Guide
              </Link>
              <Link to="/emergency-contacts" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Emergency Contacts
              </Link>
              <Link to="/healthcare-centers" className="text-sm font-medium hover:text-rose-600 transition-colors">
                Healthcare Centers
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-rose-500 text-white text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={logout} className="text-sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="bg-rose-500 hover:bg-rose-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
