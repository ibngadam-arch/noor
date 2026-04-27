/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PrayerSchedule from './components/PrayerSchedule';
import Quran from './components/Quran';
import Tasbih from './components/Tasbih';
import NurAI from './components/NurAI';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'prayer': return <PrayerSchedule />;
      case 'quran': return <Quran />;
      case 'tasbih': return <Tasbih />;
      case 'ai': return <NurAI />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pr-24 bg-emerald-50/30 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'ai' ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'ai' ? -10 : 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-100/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-50/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}

