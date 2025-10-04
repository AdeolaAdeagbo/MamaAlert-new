
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Loader2, Mail, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, login, signup, loginWithPhone, signupWithPhone, isLoading } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, we'll simulate OTP sending
      // In production, this would call Supabase phone auth
      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phoneNumber}. For testing, use code: 123456`,
      });
      setOtpSent(true);
    } catch (error) {
      console.error('OTP error:', error);
      toast({
        title: "Failed to Send OTP",
        description: "Unable to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
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
      // For demo purposes, accept 123456 as valid OTP
      if (otp === "123456") {
        let result;
        
        if (isLogin) {
          result = await loginWithPhone?.(phoneNumber, otp);
        } else {
          result = await signupWithPhone?.(phoneNumber, firstName, lastName);
        }

        if (!result?.error) {
          toast({
            title: isLogin ? "Welcome back!" : "Account Created!",
            description: isLogin 
              ? "Successfully logged in to your MamaAlert account."
              : "Welcome to MamaAlert! You can now access your dashboard.",
          });
          return;
        }

        if (result?.error) {
          toast({
            title: "Authentication Failed",
            description: getErrorMessage(result.error),
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Unable to verify your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    if (authMethod === "phone") {
      if (!otpSent) {
        await handleSendOTP(e);
      } else {
        await handleVerifyOTP(e);
      }
      return;
    }
    
    // Email authentication
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
        console.log('Attempting login...');
        result = await login(email, password);
        
        if (!result.error) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to your MamaAlert account.",
          });
          return;
        }
      } else {
        console.log('Attempting signup...');
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <Navbar />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/c1d146a9-2b02-45d8-acf9-01d2ff34c105.png" 
                alt="MamaAlert Logo" 
                className="h-12 w-12"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Join MamaAlert"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? "Sign in to access your maternal health dashboard" 
                : "Create your account and join thousands of protected mamas"
              }
            </p>
          </div>

          <Card className="border-rose-200 dark:border-rose-800">
            <CardHeader>
              <CardTitle className="text-center">
                {isLogin ? "Sign In" : "Create Your Account"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={authMethod} onValueChange={(v) => {
                setAuthMethod(v as "email" | "phone");
                setOtpSent(false);
                setOtp("");
              }} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required={!isLogin}
                            disabled={isSubmitting}
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={!isLogin}
                            disabled={isSubmitting}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your email address"
                        autoComplete={isLogin ? "email" : "username"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isLogin ? "Signing in..." : "Creating account..."}
                        </>
                      ) : (
                        <>
                          {isLogin ? "Sign In" : "Create Account"}
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone" className="mt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && !otpSent && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName-phone">First Name</Label>
                          <Input
                            id="firstName-phone"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required={!isLogin}
                            disabled={isSubmitting || otpSent}
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName-phone">Last Name</Label>
                          <Input
                            id="lastName-phone"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required={!isLogin}
                            disabled={isSubmitting || otpSent}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        disabled={isSubmitting || otpSent}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>

                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            disabled={isSubmitting}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          For testing, use code: 123456
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-rose-500 hover:bg-rose-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {otpSent ? "Verifying..." : "Sending OTP..."}
                        </>
                      ) : (
                        <>
                          {otpSent ? "Verify Code" : "Send Verification Code"}
                        </>
                      )}
                    </Button>

                    {otpSent && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        disabled={isSubmitting}
                      >
                        Change Phone Number
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail("");
                    setPassword("");
                    setPhoneNumber("");
                    setOtp("");
                    setOtpSent(false);
                    setFirstName("");
                    setLastName("");
                  }}
                  className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
                  disabled={isSubmitting}
                >
                  {isLogin
                    ? "Don't have an account? Join MamaAlert"
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:underline">
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
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
