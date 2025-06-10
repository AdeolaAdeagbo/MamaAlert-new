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
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
                alt="MamaAlert Logo" 
                className="h-16 w-auto mr-4"
              />
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
                MamaAlert
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your trusted companion during pregnancy. Get instant emergency support, 
              track symptoms, and stay connected with healthcare providers across Nigeria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6">
                Join MamaAlert Today
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-rose-200"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500 mb-2">24/7</div>
              <div className="text-muted-foreground">Emergency Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500 mb-2">5K+</div>
              <div className="text-muted-foreground">Mamas Protected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-500 mb-2">98%</div>
              <div className="text-muted-foreground">Alert Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="px-4 py-16 sm:px-6 lg:px-8 bg-rose-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose MamaAlert?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for Nigerian mothers-to-be who deserve immediate 
              access to maternal healthcare support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  One-tap emergency button instantly notifies your contacts and nearest healthcare center.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Symptom Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Log symptoms and get instant guidance on whether you need immediate medical attention.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Healthcare Locator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find the nearest maternal health centers and hospitals in your area.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Safe & Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your health data is encrypted and protected with military-grade security.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Appointment Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Never miss important checkups with smart reminder notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-rose-100">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Baby className="h-6 w-6 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Nigerian Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built specifically for Nigerian healthcare system with local language support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Every Mama Deserves Immediate Care
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of Nigerian women who trust MamaAlert for their pregnancy journey.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6">
              Start Your Safe Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MamaAlert. Protecting Nigerian mothers, one alert at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
