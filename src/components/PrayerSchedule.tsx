import { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronLeft } from 'lucide-react';
import { fetchPrayerTimes } from '../services/islamicService';
import { PrayerTimes } from '../types';
import { cn } from '../lib/utils';
import { translations } from '../i18n';

export default function PrayerSchedule() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const t = translations.ar;

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // Default to Makkah if denied
          setLocation({ lat: 21.4225, lon: 39.8262 });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes(location.lat, location.lon).then(data => {
        setTimes(data);
        setLoading(false);
      });
    }
  }, [location]);

  const prayerNames = [
    { key: 'Fajr', label: t.prayers.Fajr },
    { key: 'Sunrise', label: t.prayers.Sunrise },
    { key: 'Dhuhr', label: t.prayers.Dhuhr },
    { key: 'Asr', label: t.prayers.Asr },
    { key: 'Maghrib', label: t.prayers.Maghrib },
    { key: 'Isha', label: t.prayers.Isha },
  ];

  const getNextPrayer = (times: PrayerTimes) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const p of prayerNames) {
      const timeStr = times[p.key === t.prayers.Fajr ? 'Fajr' : 
                          p.key === t.prayers.Sunrise ? 'Sunrise' :
                          p.key === t.prayers.Dhuhr ? 'Dhuhr' :
                          p.key === t.prayers.Asr ? 'Asr' :
                          p.key === t.prayers.Maghrib ? 'Maghrib' : 'Isha' as keyof PrayerTimes];
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (hours * 60 + minutes > currentTime) {
        return p.label;
      }
    }
    return t.prayers.Fajr;
  };

  const nextPrayerLabel = times ? getNextPrayer(times) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-emerald-900">{t.prayer}</h2>
        <div className="flex items-center gap-1 text-emerald-500 text-sm">
          <MapPin className="w-4 h-4" />
          {location?.lat === 21.4225 ? t.makkah : t.location}
        </div>
      </div>

      <div className="grid gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-emerald-50 animate-pulse rounded-2xl" />
          ))
        ) : (
          prayerNames.map((p) => (
            <div
              key={p.key}
              className={cn(
                "p-5 rounded-2xl transition-all border flex items-center justify-between",
                nextPrayerLabel === p.label 
                  ? "bg-emerald-800 text-white border-emerald-800 shadow-lg scale-102" 
                  : "bg-white text-emerald-900 border-emerald-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Clock className={cn("w-5 h-5", nextPrayerLabel === p.label ? "text-emerald-200" : "text-emerald-400")} />
                <span className="font-medium text-lg">{p.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl">{times![p.key === t.prayers.Fajr ? 'Fajr' : 
                                                            p.key === t.prayers.Sunrise ? 'Sunrise' :
                                                            p.key === t.prayers.Dhuhr ? 'Dhuhr' :
                                                            p.key === t.prayers.Asr ? 'Asr' :
                                                            p.key === t.prayers.Maghrib ? 'Maghrib' : 'Isha' as keyof PrayerTimes]}</span>
                {nextPrayerLabel === p.label && <ChevronLeft className="w-5 h-5" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
