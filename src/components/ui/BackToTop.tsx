'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-600 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:bg-red-700 ${
        visible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <ArrowUp size={20} />
    </button>
  );
}
