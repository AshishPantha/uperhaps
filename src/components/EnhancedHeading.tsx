import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Bookmark, Star, Heart } from 'lucide-react';

const bookQuotes = [
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "The person who deserves most pity is a lonesome one on a rainy day who doesn't know how to read.", author: "Benjamin Franklin" },
  { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" }
];

const iconComponents = [Book, Bookmark, Star, Heart];

const EnhancedHeading = () => {
  const [currentQuote, setCurrentQuote] = useState(bookQuotes[0]);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    const intervalDuration = 7000;

    const interval = setInterval(() => {
      setShowIcon(true);
      setTimeout(() => setShowIcon(false), 2000);
      setCurrentIcon((prevIcon) => (prevIcon + 1) % iconComponents.length);
      setCurrentQuote((prevQuote) => bookQuotes[(bookQuotes.indexOf(prevQuote) + 1) % bookQuotes.length]);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, []);

  const IconComponent = iconComponents[currentIcon];

  return (
    <div className="text-center mb-12 relative">
      <div className="h-24 mb-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showIcon ? (
            <motion.div
              key="icon"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <IconComponent size={24} className="text-green-600" />
            </motion.div>
          ) : (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-md px-4"
            >
              <p className="text-muted-foreground mb-1 text-sm italic leading-relaxed">&ldquo;{currentQuote.text}&rdquo;</p>
              <p className="text-xs text-green-600 font-medium">- {currentQuote.author}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight relative">
          <span className="bg-gradient-to-r from-black via-green-800 to-green-600 inline-block text-transparent bg-clip-text">
            Literary Odyssey
          </span>
        </h1>
        <p className="text-sm sm:text-base text-green-700 font-medium tracking-wide">
          Embark on a journey through words
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6 text-sm text-gray-600 max-w-md mx-auto"
      >
        Discover your favorites among timeless classics and contemporary gems. 
      </motion.div>
    </div>
  );
};

export default EnhancedHeading;