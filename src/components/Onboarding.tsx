import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSlides = [
  {
    title: 'Track your pregnancy journey with MamaAlert',
    description: 'MamaAlert - your maternal health assistant helps you track your pregnancy week by week and gives you personalized health insights',
    illustration: 'https://images.unsplash.com/photo-1760292421911-964db7e9fca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFudCUyMHdvbWFuJTIwaWxsdXN0cmF0aW9uJTIwbWluaW1hbHxlbnwxfHx8fDE3NjI3MDQ5NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'bg-[#FFD4E5]',
    indicatorColor: 'bg-[#E85883]',
  },
  {
    title: "Monitor your health and baby's development",
    description: 'Track vital signs, fetal kicks, appointments, and get daily health tips tailored to your pregnancy stage',
    illustration: 'https://images.unsplash.com/photo-1624013599885-6e5808855824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBiYWJ5JTIwaGVhbHRoJTIwY2FyZXxlbnwxfHx8fDE3NjI3MDQ5NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'bg-[#E8D4FF]',
    indicatorColor: 'bg-[#A855F7]',
  },
  {
    title: 'Emergency support when you need it',
    description: 'Quick access to emergency contacts, nearest hospitals, and instant alerts to keep you and your baby safe',
    illustration: 'https://images.unsplash.com/photo-1661256545534-9770a8ea2146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcm5hbCUyMGhlYWx0aCUyMHN1cHBvcnR8ZW58MXx8fHwxNzYyNzA0OTU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bgColor: 'bg-[#FFF4D4]',
    indicatorColor: 'bg-[#F59E0B]',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentSlideData = onboardingSlides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {/* Illustration section */}
          <div className={`flex-1 ${currentSlideData.bgColor} flex items-center justify-center p-8 pt-16`}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-sm w-full"
            >
              <ImageWithFallback
                src={currentSlideData.illustration}
                alt={currentSlideData.title}
                className="w-full h-auto object-contain rounded-3xl"
              />
            </motion.div>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-t-[40px] p-8 pt-10 shadow-2xl">
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {onboardingSlides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="transition-all duration-300"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? `w-8 h-2 ${currentSlideData.indicatorColor}`
                        : 'w-2 h-2 bg-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Title */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-gray-900 mb-4"
            >
              {currentSlideData.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 leading-relaxed mb-8"
            >
              {currentSlideData.description}
            </motion.p>

            {/* Next button */}
            <Button
              onClick={handleNext}
              className="w-full h-14 bg-[#E85883] hover:bg-[#D14570] text-white rounded-2xl shadow-md transition-all duration-300"
            >
              {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            </Button>

            {/* Skip button */}
            {currentSlide < onboardingSlides.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full text-center text-gray-400 mt-4 hover:text-gray-600 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
