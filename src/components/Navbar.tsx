import { useAuth } from "./AuthProvider";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  // Hide navbar on certain mobile-optimized pages
  const hiddenPaths = ['/dashboard', '/ai-nurse', '/symptom-logger', '/postpartum-care', '/profile'];
  const shouldHideOnMobile = user && hiddenPaths.includes(location.pathname);

  return (
    <nav className={cn(
      "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-soft safe-top",
      shouldHideOnMobile && "md:block hidden"
    )}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
              alt="MamaAlert Logo" 
              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
            />
            <h1 className="text-base sm:text-lg font-bold text-primary">MamaAlert</h1>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 touch-target"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* User controls */}
            {user ? (
              <Link to="/profile" className="touch-target">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="h-9 px-4">
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

import { cn } from "@/lib/utils";