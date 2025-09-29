import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Link, Navigate } from "react-router-dom";
import { Heart, Shield, Phone, MapPin, Clock, Baby } from "lucide-react";
import heroImage from '@/assets/hero-maternal-care-new.jpg';
import healthcareTeamImage from '@/assets/healthcare-team.jpg';
import pregnantWomanImage from '@/assets/pregnant-woman-phone.jpg';

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
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-orange-950/20" />
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Background maternal care" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <img 
                  src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
                  alt="MamaAlert Logo" 
                  className="h-12 w-auto mr-3"
                />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  MamaAlert
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Your trusted companion during pregnancy. Get instant emergency support, 
                track symptoms, and stay connected with healthcare providers across Nigeria.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                    Join MamaAlert Today
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  onClick={scrollToFeatures}
                >
                  Learn More
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-500 mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Emergency Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-500 mb-1">5K+</div>
                  <div className="text-sm text-muted-foreground">Mamas Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-500 mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Alert Success</div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="African mother with newborn baby in hospital setting" 
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Emergency Ready</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="text-sm">
                  <div className="font-semibold text-rose-500">Instant Alert</div>
                  <div className="text-muted-foreground">{"< 30 seconds"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Trusted by Nigerian Mothers
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our healthcare team works 24/7 to ensure you receive immediate support 
                when you need it most. Every alert is taken seriously, every mother matters.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-foreground">Instant emergency response</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-foreground">24/7 healthcare support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-foreground">Local Nigerian healthcare network</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={healthcareTeamImage} 
                alt="Nigerian healthcare team" 
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/10 dark:to-pink-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Maternal Care Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed specifically for Nigerian mothers-to-be who deserve 
              immediate access to quality maternal healthcare.
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
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Every Mama Deserves Immediate Care
              </h2>
              <p className="text-lg text-rose-100 mb-8 leading-relaxed">
                Join thousands of Nigerian women who trust MamaAlert for their pregnancy journey. 
                Because when seconds count, you need support you can rely on.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-white text-rose-600 hover:bg-rose-50 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Start Your Safe Journey
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src={pregnantWomanImage} 
                alt="Pregnant woman using MamaAlert app" 
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-lg p-3 shadow-lg">
                <div className="text-sm text-gray-900">
                  <div className="font-semibold">Always Protected</div>
                  <div className="text-gray-600">24/7 Emergency Ready</div>
                </div>
              </div>
            </div>
          </div>
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