
import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { SignIn } from './components/SignIn';
import { Dashboard } from './components/Dashboard';

type Screen = 'splash' | 'onboarding' | 'signin' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={() => setCurrentScreen('onboarding')} />
      )}
      
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={() => setCurrentScreen('signin')} />
      )}
      
      {currentScreen === 'signin' && (
        <SignIn onComplete={() => setCurrentScreen('dashboard')} />
      )}
      
      {currentScreen === 'dashboard' && <Dashboard />}
    </div>
  );
}
