export interface Verse {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  transliteration?: string;
  tafsir?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  verses?: Verse[];
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  verseNumber: number;
  note?: string;
  createdAt: Date;
}

export interface ReadingProgress {
  surahNumber: number;
  verseNumber: number;
  lastRead: Date;
}

export interface Settings {
  fontSize: number;
  translationEnabled: boolean;
  transliterationEnabled: boolean;
  theme: 'light' | 'dark';
  reciter: string;
  language: string;
}

export interface PrayerTime {
  name: string;
  time: string;
}
