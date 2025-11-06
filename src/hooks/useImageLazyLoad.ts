import { useEffect, useRef, useState } from 'react';

export const useImageLazyLoad = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target as HTMLImageElement;
            const src = imgElement.dataset.src;
            if (src) {
              imgElement.src = src;
              imgElement.onload = () => setIsLoaded(true);
            }
            observer.unobserve(imgElement);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, []);

  return { imgRef, isLoaded };
};
