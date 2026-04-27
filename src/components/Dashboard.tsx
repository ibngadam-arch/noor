import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { formatHijriDate, formatDate } from '../lib/utils';
import { fetchDailyVerse } from '../services/islamicService';
import { translations } from '../i18n';
import { Quote, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [verse, setVerse] = useState<{ text: string, surah: string, number: number } | null>(null);
  const t = translations.ar;

  useEffect(() => {
    fetchDailyVerse().then(setVerse);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="bg-emerald-900/5 rounded-3xl p-8 border border-emerald-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-emerald-800 font-serif text-3xl md:text-5xl font-medium leading-tight">
            {t.greeting}
          </h2>
          <p className="text-emerald-600 mt-2 font-medium">
            {formatDate(new Date(), 'ar')} • {formatHijriDate(new Date())}
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <Sparkles className="absolute top-8 left-8 text-emerald-200 w-12 h-12" />
      </header>

      <section className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-50 relative">
        <div className="flex items-center gap-2 text-emerald-600 mb-6 font-mono text-xs uppercase tracking-widest">
          <Quote className="w-4 h-4 ml-1" />
          {t.dailyInspiration}
        </div>
        {verse ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-xl md:text-2xl text-emerald-900 leading-relaxed font-serif">
              “{verse.text}”
            </p>
            <p className="text-emerald-500 font-medium italic">
              — سورة {verse.surah}، آية {verse.number}
            </p>
          </motion.div>
        ) : (
          <div className="h-32 bg-emerald-50/50 animate-pulse rounded-2xl" />
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 transition-hover hover:shadow-md">
          <h3 className="text-amber-800 font-bold mb-2">{t.morningAdhkar}</h3>
          <p className="text-amber-700/80 text-sm">{t.adhkarDesc}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 transition-hover hover:shadow-md">
          <h3 className="text-blue-800 font-bold mb-2">{t.ramadanCountdown}</h3>
          <p className="text-blue-700/80 text-sm">{t.ramadanDesc}</p>
        </div>
      </div>
    </div>
  );
}
