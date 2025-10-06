import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { useMode } from "@/contexts/ModeContext";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Bell, Moon, Sun, LogOut, Settings as SettingsIcon } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currentMode } = useMode();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    notifications: {
      push: true,
    }
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-background dark:via-background dark:to-card pb-20">
        <Navbar />
        
        <div className="mobile-container py-6 space-y-4">
          {/* Profile Header */}
          <Card className="shadow-lg">
            <CardContent className="pt-8 pb-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.firstName?.[0] || ''}{user?.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
              <Badge>
                {currentMode === 'pregnancy' ? '🤰 Pregnancy Mode' : '👶 Postpartum Mode'}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <div className="space-y-3">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Quick Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <p className="font-medium text-sm">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Toggle theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-sm">Notifications</p>
                      <p className="text-xs text-muted-foreground">Manage alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile.notifications.push}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile,
                        notifications: { ...profile.notifications, push: checked }
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button
              onClick={logout}
              variant="destructive"
              className="w-full touch-target h-12 active:scale-95 transition-transform"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </>
  );
};

export default Profile;
