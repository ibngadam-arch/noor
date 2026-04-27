import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Search, Loader2 } from 'lucide-react';
import { fetchSurahs, fetchSurahDetail } from '../services/islamicService';
import { Surah, Ayah } from '../types';
import { translations } from '../i18n';
import { cn } from '../lib/utils';

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const t = translations.ar;

  useEffect(() => {
    fetchSurahs().then(data => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  const handleSurahClick = async (surah: Surah) => {
    setLoading(true);
    setSelectedSurah(surah);
    const detail = await fetchSurahDetail(surah.number);
    setAyahs(detail.ayahs);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString() === search ||
    s.name.includes(search)
  );

  if (selectedSurah) {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-left-4 duration-500">
        <button 
          onClick={() => setSelectedSurah(null)}
          className="flex items-center gap-2 text-emerald-600 font-medium hover:bg-emerald-50 p-2 rounded-xl"
        >
          <ChevronRight className="w-5 h-5" />
          {t.backToList}
        </button>

        <div className="text-center py-8 space-y-2 border-b border-emerald-100">
          <h2 className="text-3xl font-serif text-emerald-900">{selectedSurah.name}</h2>
          <p className="text-emerald-500 uppercase tracking-widest text-sm font-medium">
             {selectedSurah.numberOfAyahs} {t.ayahs}
          </p>
          <p className="text-emerald-900/60 font-serif text-lg pt-4 leading-relaxed max-w-lg mx-auto">
             بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        <div className="space-y-8 pt-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
          ) : (
            ayahs.map((ayah) => (
              <div key={ayah.number} className="group flex flex-col items-end space-y-4">
                <div className="flex justify-between items-center w-full mb-2">
                   <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-700 border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {ayah.numberInSurah}
                  </div>
                </div>
                <p className="text-right text-3xl md:text-4xl text-emerald-900 leading-[2] font-serif" dir="rtl">
                  {ayah.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-emerald-900">{t.quran}</h2>
        <BookOpen className="text-emerald-500 w-6 h-6" />
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
        <input 
          type="text"
          placeholder={t.searchSurah}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-12 pl-6 py-4 bg-white border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-emerald-300"
        />
      </div>

      <div className="grid gap-3">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-20 bg-emerald-50 animate-pulse rounded-2xl" />
          ))
        ) : (
          filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              onClick={() => handleSurahClick(surah)}
              className="group p-4 bg-white border border-emerald-100 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-sm font-bold text-emerald-700 border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  {surah.number}
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 font-serif text-xl">{surah.name}</h3>
                  <p className="text-xs text-emerald-500 uppercase tracking-tighter">{surah.englishName}</p>
                </div>
              </div>
              <div className="text-left">
                <div className="font-serif text-lg text-emerald-800">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</div>
                <p className="text-[10px] text-emerald-400 font-medium uppercase">{surah.numberOfAyahs} آية</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
