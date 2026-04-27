import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Fingerprint } from 'lucide-react';
import { translations } from '../i18n';
import { cn } from '../lib/utils';

export default function Tasbih() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(33);
  const [isVibrating, setIsVibrating] = useState(false);
  const t = translations.ar;

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 100);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  const reset = () => setCount(0);

  const progress = (count % goal) / goal * 100;
  const circuit = Math.floor(count / goal);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif text-emerald-900">{t.digitalTasbih}</h2>
        <p className="text-emerald-500 font-medium uppercase tracking-widest text-xs">
          {t.cycle}: {circuit} • {t.goal}: {goal}
        </p>
      </div>

      <div className="relative">
        {/* Progress ring */}
        <svg className="w-64 h-64 -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-emerald-50"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
            className="text-emerald-600"
          />
        </svg>

        {/* Counter button */}
        <motion.button
          onClick={increment}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "absolute inset-4 rounded-full bg-white shadow-xl border-4 border-emerald-50 flex flex-col items-center justify-center transition-all",
            isVibrating && "border-emerald-200"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-6xl font-serif font-bold text-emerald-900"
            >
              {count}
            </motion.span>
          </AnimatePresence>
          <Fingerprint className="text-emerald-200 mt-4 w-8 h-8" />
        </motion.button>
      </div>

      <div className="flex gap-4">
        {[33, 99, 100].map(val => (
          <button 
            key={val}
            onClick={() => setGoal(val)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all",
              goal === val ? "bg-emerald-800 text-white" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            )}
          >
            {val}
          </button>
        ))}
        <button 
          onClick={reset}
          className="p-3 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all mr-4"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <p className="text-emerald-400 text-sm italic text-center max-w-xs font-serif text-lg">
        {t.remembranceQuote}
      </p>
    </div>
  );
}
