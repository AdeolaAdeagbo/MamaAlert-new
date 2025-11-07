import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Loader2, Heart, Mail, Lock, User, Sparkles, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const { user, login, signup, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Show loading screen while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse fill-primary" />
            <p className="text-muted-foreground">Just a moment, mama...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't show auth form
  if (user) {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    
    if (error) {
      toast({
        title: "Couldn't send reset link",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Check your email 💌",
      description: "We've sent you a password reset link. It should arrive within a few minutes.",
    });
    setShowForgotPassword(false);
    setResetEmail("");
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showOtpInput) {
      // Send OTP
      if (!phoneNumber) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      
      if (error) {
        toast({
          title: "Couldn't send OTP",
          description: getErrorMessage(error),
          variant: "destructive",
        });
        return;
      }
      
      setShowOtpInput(true);
      toast({
        title: "Code sent! 📱",
        description: "Check your phone for the verification code.",
      });
    } else {
      // Verify OTP
      if (!otp) {
        toast({
          title: "Code Required",
          description: "Please enter the verification code.",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });
      
      if (error) {
        toast({
          title: "Invalid code",
          description: getErrorMessage(error),
          variant: "destructive",
        });
        return;
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        toast({
          title: "Welcome, mama! 💕",
          description: "You're all set. Let's check on you and baby.",
        });
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "We need a few details, mama",
        description: "Please enter both your email and password.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      toast({
        title: "Just a little more",
        description: "Please let us know your name so we can personalize your experience.",
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
          setShowSuccess(true);
          setTimeout(() => {
            toast({
              title: "Welcome back, mama! 💕",
              description: "We're so glad you're here. Let's check on you and baby.",
            });
          }, 800);
          return;
        }
      } else {
        result = await signup(email, password, firstName, lastName);
        
        if (!result.error) {
          setShowSuccess(true);
          setTimeout(() => {
            toast({
              title: "Welcome to the MamaAlert family! 🌸",
              description: "You're taking such good care of yourself and baby. Let's get started.",
            });
          }, 800);
          return;
        }
      }

      if (result.error) {
        toast({
          title: isLogin ? "Hmm, that didn't work" : "We couldn't create your account",
          description: getErrorMessage(result.error),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection trouble",
        description: "Check your internet and try again, or reach out if this keeps happening.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success animation screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div className="relative mb-6">
            <Heart className="h-20 w-20 mx-auto text-primary fill-primary animate-bounce-subtle" />
            <Sparkles className="h-8 w-8 absolute top-0 right-1/3 text-accent-gold animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {isLogin ? "Welcome back, mama! 💕" : "You're in! 🌸"}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? "Getting your dashboard ready..." : "Setting up your safe space..."}
          </p>
        </div>
      </div>
    );
  }

  // Phone auth modal
  if (showPhoneAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-primary/20 shadow-large">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Sign In with Phone</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {showOtpInput ? "Enter the code we sent to your phone" : "We'll send you a verification code"}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneAuth} className="space-y-4">
                {!showOtpInput ? (
                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Include country code (e.g., +234 for Nigeria)
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="otp" className="text-sm">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" size="lg">
                  {showOtpInput ? "Verify Code" : "Send Code"}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowPhoneAuth(false);
                    setPhoneNumber("");
                    setOtp("");
                    setShowOtpInput(false);
                  }}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot password modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-primary/20 shadow-large">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Reset Your Password</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                No worries, mama. We'll send you a reset link.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail" className="text-sm">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  Send Reset Link
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Floating hearts decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-20 left-10 h-8 w-8 text-primary/10 animate-float" style={{ animationDelay: '0s' }} />
        <Heart className="absolute top-40 right-20 h-6 w-6 text-primary/10 animate-float" style={{ animationDelay: '2s' }} />
        <Heart className="absolute bottom-32 left-1/4 h-10 w-10 text-primary/10 animate-float" style={{ animationDelay: '4s' }} />
        <Sparkles className="absolute top-1/3 right-1/4 h-8 w-8 text-accent-gold/20 animate-pulse" />
      </div>
      
      <div className="flex min-h-screen items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo and Welcome */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center shadow-soft">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {isLogin ? "Welcome Back, Mama" : "Join MamaAlert"}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isLogin 
                ? "We've missed you. Let's check in on you and baby." 
                : "Your journey to safer motherhood starts here. We're with you every step of the way."
              }
            </p>
          </div>

          {/* Auth Card */}
          <Card className="border-primary/20 shadow-large backdrop-blur-sm bg-card/95">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required={!isLogin}
                          disabled={isSubmitting}
                          placeholder="First"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required={!isLogin}
                          disabled={isSubmitting}
                          placeholder="Last"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      placeholder="your.email@example.com"
                      className="pl-10 h-11"
                      autoComplete={isLogin ? "email" : "username"}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      placeholder={isLogin ? "••••••••" : "At least 6 characters"}
                      className="pl-10 h-11"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium mt-6"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isLogin ? "Signing you in..." : "Creating your account..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create My Account"}
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Phone Auth Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowPhoneAuth(true)}
                disabled={isSubmitting}
              >
                <Phone className="h-4 w-4 mr-2" />
                Sign in with Phone
              </Button>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail("");
                    setPassword("");
                    setFirstName("");
                    setLastName("");
                  }}
                  className="text-sm text-primary hover:underline font-medium"
                  disabled={isSubmitting}
                >
                  {isLogin
                    ? "New here? Join the MamaAlert family →"
                    : "Already have an account? Sign in →"
                  }
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-6 space-y-3 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block">
              ← Back to home
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">
              By joining, you agree to receive caring reminders and emergency notifications 
              to keep you and baby safe. We're here for you. 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
