import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Heart } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-pink via-background to-accent">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const getErrorMessage = (error: any) => {
    if (!error) return "An unexpected error occurred.";
    
    const message = error.message || error.error_description || error.toString();
    
    if (message.includes('Invalid login credentials')) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    if (message.includes('Email not confirmed')) {
      return "Please check your email and click the confirmation link before signing in.";
    }
    if (message.includes('User already registered')) {
      return "An account with this email already exists. Please sign in instead.";
    }
    if (message.includes('Password should be at least')) {
      return "Password must be at least 6 characters long.";
    }
    if (message.includes('Unable to validate email address')) {
      return "Please enter a valid email address.";
    }
    if (message.includes('signup_disabled')) {
      return "New user registration is currently disabled.";
    }
    
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      toast({
        title: "Missing Information",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
        
        if (!result.error) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your MamaAlert account.",
          });
          return;
        }
      } else {
        result = await signup(email, password, firstName, lastName);
        
        if (!result.error) {
          toast({
            title: "Account Created!",
            description: "Welcome to MamaAlert! You can now access your dashboard.",
          });
          return;
        }
      }

      if (result.error) {
        toast({
          title: isLogin ? "Sign In Failed" : "Sign Up Failed",
          description: getErrorMessage(result.error),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-accent-pink via-background to-accent animate-fade-in">
      {/* Header with Logo */}
      <div className="flex-none px-6 pt-8 pb-4">
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
            alt="MamaAlert Logo" 
            className="h-12 w-12"
          />
          <h1 className="text-2xl font-display font-bold text-foreground">MamaAlert</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          {/* Welcome Text */}
          <div className="text-center mb-8 space-y-2">
            <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-display font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join MamaAlert"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? "Your pregnancy companion awaits" 
                : "Your journey to safe motherhood starts here"
              }
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-card rounded-3xl shadow-card p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                      disabled={isSubmitting}
                      placeholder="Jane"
                      className="h-12 rounded-2xl border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                      disabled={isSubmitting}
                      placeholder="Doe"
                      className="h-12 rounded-2xl border-border"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="you@example.com"
                  autoComplete={isLogin ? "email" : "username"}
                  className="h-12 rounded-2xl border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder={isLogin ? "Enter password" : "Min. 6 characters"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="h-12 rounded-2xl border-border"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-dark text-primary-foreground font-medium shadow-medium native-transition touch-target"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>{isLogin ? "Sign In" : "Create Account"}</>
                )}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFirstName("");
                  setLastName("");
                }}
                className="text-sm text-primary font-medium native-transition"
                disabled={isSubmitting}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-muted-foreground mt-6 px-4">
            By continuing, you agree to receive pregnancy health notifications and emergency alerts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
