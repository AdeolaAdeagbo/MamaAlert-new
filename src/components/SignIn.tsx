import { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import logo from '../assets/mamalogo.png'; 

interface SignInProps {
  onComplete: () => void;
}

export function SignIn({ onComplete }: SignInProps) {
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Sign in logic would go here
    console.log('Signing in with:', signInMethod === 'email' ? email : phone);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 via-white to-white flex flex-col items-center px-6 py-8">
      {/* Logo and branding */}
      <div className="text-center mb-12 mt-8">
        <img 
          src={logo} 
          alt="MamaAlert" 
          className="h-16 mx-auto mb-4"
        />
        <p className="text-gray-600">Your maternal health companion</p>
      </div>

      {/* Welcome text */}
      <div className="w-full max-w-sm mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500">Sign in to continue your journey</p>
      </div>

      {/* Sign in method toggle */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex bg-gray-50/80 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setSignInMethod('email')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-200 ${
              signInMethod === 'email'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setSignInMethod('phone')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all duration-200 ${
              signInMethod === 'phone'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600'
            }`}
          >
            Phone
          </button>
        </div>
      </div>

      {/* Input fields */}
      <div className="w-full max-w-sm space-y-4 mb-4">
        {signInMethod === 'email' ? (
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#E85883] transition-colors" />
            <Input
              type="email"
              placeholder="yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 bg-white border border-gray-200 rounded-2xl focus:border-[#E85883] focus:ring-2 focus:ring-[#E85883]/20 transition-all"
            />
          </div>
        ) : (
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#E85883] transition-colors" />
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-12 h-14 bg-white border border-gray-200 rounded-2xl focus:border-[#E85883] focus:ring-2 focus:ring-[#E85883]/20 transition-all"
            />
          </div>
        )}

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#E85883] transition-colors" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12 pr-12 h-14 bg-white border border-gray-200 rounded-2xl focus:border-[#E85883] focus:ring-2 focus:ring-[#E85883]/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="w-full max-w-sm text-right mb-8">
        <button className="text-sm text-[#E85883] hover:text-[#D14570] transition-colors">
          Forgot password?
        </button>
      </div>

      {/* Sign in button */}
      <div className="w-full max-w-sm mb-8">
        <Button
          onClick={handleSignIn}
          className="w-full h-14 bg-gradient-to-r from-[#E85883] to-[#D14570] hover:from-[#D14570] hover:to-[#E85883] text-white rounded-2xl shadow-lg shadow-pink-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-300/50"
        >
          Sign in
        </Button>
      </div>

      {/* Divider */}
      <div className="w-full max-w-sm flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social sign-in buttons */}
      <div className="w-full max-w-sm flex justify-center gap-4 mb-8">
        <button className="flex-1 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </button>

        <button className="flex-1 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button className="flex-1 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>

      {/* Register link */}
      <div className="text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <button className="text-[#E85883] hover:text-[#D14570] transition-colors">
          Register
        </button>
      </div>
    </div>
  );
}
