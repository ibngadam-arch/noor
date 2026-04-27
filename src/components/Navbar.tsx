import { motion } from 'motion/react';
import { Home, Book, Fingerprint, MessageCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { translations } from '../i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const t = translations.ar;
  const tabs = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'prayer', icon: Clock, label: t.prayer },
    { id: 'quran', icon: Book, label: t.quran },
    { id: 'tasbih', icon: Fingerprint, label: t.tasbih },
    { id: 'ai', icon: MessageCircle, label: t.ai },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-emerald-100 px-6 py-3 z-50 md:top-0 md:bottom-0 md:right-0 md:left-auto md:w-24 md:flex-col md:border-t-0 md:border-l">
      <div className="flex justify-between items-center md:flex-col md:h-full md:py-8">
        <div className="hidden md:block mb-8 text-emerald-800 font-serif text-2xl font-bold">ن</div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all relative",
              activeTab === tab.id ? "text-emerald-700" : "text-emerald-400 hover:text-emerald-500"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -inset-2 bg-emerald-50 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
