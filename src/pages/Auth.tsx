
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Heart, Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const getErrorMessage = (error: any) => {
    if (!error) return "An unexpected error occurred.";
    
    const message = error.message || error.error_description || error.toString();
    
    // Common Supabase auth error messages
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
    
    // Basic validation
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      
      if (isLogin) {
        console.log('Attempting login for:', email);
        result = await login(email, password);
        
        if (!result.error) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your MamaAlert account.",
          });
          // Navigation handled by AuthProvider
        }
      } else {
        console.log('Attempting signup for:', email);
        result = await signup(email, password, firstName, lastName);
        
        if (!result.error) {
          toast({
            title: "Account Created!",
            description: "Welcome to MamaAlert! You can now access your dashboard.",
          });
          // Navigation handled by AuthProvider
        }
      }

      if (result.error) {
        console.error('Auth error:', result.error);
        toast({
          title: isLogin ? "Sign In Failed" : "Sign Up Failed",
          description: getErrorMessage(result.error),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auth exception:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" fill="currentColor" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Join MamaAlert"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to access your maternal health dashboard" 
                : "Create your account to get started with safe pregnancy monitoring"
              }
            </p>
          </div>

          <Card className="border shadow-xl bg-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-xl">
                {isLogin ? "Sign In" : "Create Account"}
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                {isLogin 
                  ? "Enter your credentials to continue" 
                  : "Fill in your details to get started"
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                        disabled={isSubmitting}
                        placeholder="Enter your first name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                        disabled={isSubmitting}
                        placeholder="Enter your last name"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your email address"
                    autoComplete={isLogin ? "email" : "username"}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder={isLogin ? "Enter your password" : "Create a secure password (min 6 characters)"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // Clear form when switching
                    setEmail("");
                    setPassword("");
                    setFirstName("");
                    setLastName("");
                  }}
                  className="text-sm text-primary hover:text-primary/80 hover:underline font-medium"
                  disabled={isSubmitting}
                >
                  {isLogin
                    ? "Don't have an account? Create one here"
                    : "Already have an account? Sign in here"
                  }
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              By creating an account, you agree to receive emergency notifications 
              and health reminders to keep you and your baby safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
