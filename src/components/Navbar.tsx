import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import { useMode } from "@/contexts/ModeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DeliveryLogger } from "@/components/DeliveryLogger";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currentMode, switchToPregnancy, isLoading: modeLoading } = useMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Fixed size to prevent collision */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img 
              src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
              alt="MamaAlert Logo" 
              className="h-8 w-8 flex-shrink-0"
            />
            <h1 className="text-lg sm:text-xl font-bold text-primary truncate">MamaAlert</h1>
          </Link>

          {/* Desktop Navigation - Hidden on smaller screens to prevent collision */}
          {user && (
            <div className="hidden xl:flex items-center space-x-4 flex-1 justify-center max-w-4xl">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Dashboard
              </Link>
              <Link to="/ai-nurse" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                AI Nurse
              </Link>
              <Link to="/symptom-logger" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Log Symptoms
              </Link>
              <Link to="/symptom-guide" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Symptom Guide
              </Link>
              <Link to="/emergency-contacts" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Emergency
              </Link>
              <Link to="/healthcare-centers" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                Healthcare
              </Link>
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex-shrink-0"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile menu button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden flex-shrink-0"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* User controls */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={logout} className="text-sm hidden sm:block">
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="flex-shrink-0">
                <Button variant="default" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && isMobileMenuOpen && (
          <div className="xl:hidden border-t border-border bg-card/95 backdrop-blur shadow-soft">
            <div className="px-4 py-4 space-y-3">
              <Link 
                to="/dashboard" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/ai-nurse" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AI Nurse
              </Link>
              <Link 
                to="/symptom-logger" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log Symptoms
              </Link>
              <Link 
                to="/symptom-guide" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Symptom Guide
              </Link>
              <Link 
                to="/emergency-contacts" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Emergency Contacts
              </Link>
              <Link 
                to="/healthcare-centers" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Healthcare Centers
              </Link>
              <Link 
                to="/postpartum-care" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Postpartum Care
              </Link>
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="text-sm w-full justify-start mt-4 sm:hidden"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}