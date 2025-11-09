import { useEffect } from 'react';
import { motion } from "framer-motion";
import logo from '../assets/mamalogo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-4"
      >
        <img 
          src={logo} 
          alt="MamaAlert" 
          className="h-20 mx-auto"
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <p className="text-[#E85883]">your maternal health assistant</p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12"
      >
        <div className="flex space-x-2">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-[#E85883] rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-[#D14570] rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-[#E85883] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
