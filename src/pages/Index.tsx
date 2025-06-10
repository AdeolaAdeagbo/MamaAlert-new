
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Link, Navigate } from "react-router-dom";
import { Heart, Shield, Phone, MapPin, Clock, Baby } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl mr-4">
                <Heart className="h-10 w-10 text-white" fill="currentColor" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
                MamaAlert
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted companion during pregnancy. Get instant emergency support, 
              track symptoms, and stay connected with healthcare providers across Nigeria. 💕
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-lg">
                <Heart className="h-5 w-5 mr-2" />
                Join MamaAlert Today
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-rose-200 hover:bg-rose-50"
              onClick={scrollToFeatures}
            >
              Learn More About Protection
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-rose-500 mb-2">24/7</div>
              <div className="text-muted-foreground">Emergency Support</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-rose-500 mb-2">5K+</div>
              <div className="text-muted-foreground">Mamas Protected</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-rose-500 mb-2">98%</div>
              <div className="text-muted-foreground">Alert Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose MamaAlert? 🤱
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for Nigerian mothers-to-be who deserve immediate 
              access to maternal healthcare support and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-red-50 to-rose-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Phone className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  One-tap emergency button instantly notifies your contacts and nearest healthcare center with your location.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-pink-50 to-rose-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Symptom Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Log symptoms and get instant AI-powered guidance on whether you need immediate medical attention.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Healthcare Locator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find the nearest maternal health centers and hospitals in your area with real-time availability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Safe & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your health data is encrypted and protected with military-grade security standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Smart Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Never miss important checkups with intelligent reminder notifications and appointment tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 border-rose-100 hover:border-rose-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Baby className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">Nigerian Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built specifically for Nigerian healthcare system with local language support and cultural understanding.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Every Mama Deserves Immediate Care 💝
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of Nigerian women who trust MamaAlert for their pregnancy journey and peace of mind.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-lg">
              <Heart className="h-5 w-5 mr-2" />
              Start Your Safe Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert. Protecting Nigerian mothers, one alert at a time. 💕</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
