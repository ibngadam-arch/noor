import { PrayerTimes, Surah, Ayah } from '../types';

export const fetchPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTimes> => {
  const date = new Date();
  const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${latitude}&longitude=${longitude}&method=2`);
  const data = await res.json();
  return data.data.timings;
};

export const fetchSurahs = async (): Promise<Surah[]> => {
  const res = await fetch('https://api.alquran.cloud/v1/surah');
  const data = await res.json();
  return data.data;
};

export const fetchSurahDetail = async (number: number): Promise<{ ayahs: Ayah[], name: string, englishName: string }> => {
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
  const data = await res.json();
  return {
    ayahs: data.data.ayahs,
    name: data.data.name,
    englishName: data.data.englishName
  };
};

export const fetchDailyVerse = async (): Promise<{ text: string, surah: string, number: number }> => {
  // Random ayah between 1 and 6236
  const randomAyah = Math.floor(Math.random() * 6236) + 1;
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/en.asad`);
  const data = await res.json();
  return {
    text: data.data.text,
    surah: data.data.surah.englishName,
    number: data.data.numberInSurah
  };
};
