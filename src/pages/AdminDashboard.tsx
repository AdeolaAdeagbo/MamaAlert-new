
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigate, Link } from "react-router-dom";
import { 
  Users, 
  AlertTriangle, 
  Heart, 
  MapPin, 
  TrendingUp, 
  Clock,
  Shield,
  LogOut
} from "lucide-react";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("mamaalert-admin");
    setIsAdmin(adminStatus === "true");
  }, []);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("mamaalert-admin");
    setIsAdmin(false);
  };

  // Mock admin data
  const stats = {
    totalUsers: 5247,
    activeUsers: 3891,
    emergencyAlerts: 23,
    symptomReports: 156,
    healthcareCenters: 47
  };

  const recentAlerts = [
    {
      id: "1",
      userId: "user_123",
      userName: "Fatima A.",
      symptom: "Severe headache with vision changes",
      timestamp: "2024-01-15 14:32",
      status: "resolved",
      location: "Lagos, Nigeria"
    },
    {
      id: "2", 
      userId: "user_456",
      userName: "Blessing O.",
      symptom: "Heavy bleeding",
      timestamp: "2024-01-15 13:15",
      status: "active",
      location: "Abuja, Nigeria"
    },
    {
      id: "3",
      userId: "user_789", 
      userName: "Grace N.",
      symptom: "Severe abdominal pain",
      timestamp: "2024-01-15 11:45",
      status: "resolved",
      location: "Port Harcourt, Nigeria"
    }
  ];

  const recentUsers = [
    {
      id: "1",
      name: "Amina Mohammed",
      email: "amina@email.com",
      joinDate: "2024-01-15",
      location: "Kano, Nigeria",
      pregnancyWeek: 24
    },
    {
      id: "2",
      name: "Chioma Okwu", 
      email: "chioma@email.com",
      joinDate: "2024-01-14",
      location: "Lagos, Nigeria",
      pregnancyWeek: 18
    },
    {
      id: "3",
      name: "Hauwa Bello",
      email: "hauwa@email.com", 
      joinDate: "2024-01-14",
      location: "Abuja, Nigeria",
      pregnancyWeek: 32
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-rose-500" />
              <h1 className="text-xl font-bold text-rose-600">MamaAlert Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Administrator</span>
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor MamaAlert users, emergency alerts, and system health.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+12% this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Users
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emergency Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.emergencyAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Symptom Reports
                </CardTitle>
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.symptomReports}</div>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Healthcare Centers
                </CardTitle>
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.healthcareCenters}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Emergency Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Recent Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{alert.userName}</span>
                        <Badge 
                          className={alert.status === "active" ? "bg-red-500" : "bg-green-500"}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{alert.symptom}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-500" />
                Recent User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{user.name}</span>
                        <Badge variant="outline">Week {user.pregnancyWeek}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Joined: {user.joinDate}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Healthcare Centers
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alert Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                System Health
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>MamaAlert Admin Dashboard - Protecting Nigerian mothers with technology</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
