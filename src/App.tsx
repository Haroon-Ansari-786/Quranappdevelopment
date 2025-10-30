import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { SurahList } from './components/SurahList';
import { SurahReader } from './components/SurahReader';
import { BookmarksList } from './components/BookmarksList';
import { PrayerTimes } from './components/PrayerTimes';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchDialog } from './components/SearchDialog';
import { AudioPlayer } from './components/AudioPlayer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Settings } from './types/quran';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { allSurahs, getAudioUrl } from './data/quran-data';
import {
  BookOpen,
  BookmarkCheck,
  Clock,
  Settings as SettingsIcon,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type View = 'home' | 'reader' | 'bookmarks' | 'prayer' | 'settings';

function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [view, setView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [audioPlayerData, setAudioPlayerData] = useState<{
    title: string;
    subtitle: string;
    audioUrl: string;
    surahNumber: number;
    verseNumber?: number;
  } | null>(null);

  const [settings, setSettings] = useLocalStorage<Settings>('settings', {
    fontSize: 32,
    translationEnabled: true,
    transliterationEnabled: false,
    theme: 'light',
    reciter: 'mishary',
    language: 'english'
  });

  const [bookmarksArray, setBookmarksArray] = useLocalStorage<
    Array<{ surahNumber: number; verseNumber: number }>
  >('bookmarks', []);

  const bookmarksSet = new Set(
    bookmarksArray.map(({ surahNumber, verseNumber }) => `${surahNumber}-${verseNumber}`)
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelectSurah = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setView('reader');
    setSidebarOpen(false);
  };

  const handlePlaySurah = (surahNumber: number) => {
    const surah = allSurahs.find(s => s.number === surahNumber);
    if (surah) {
      const audioUrl = getAudioUrl(surahNumber, settings.reciter);
      setAudioPlayerData({
        title: surah.englishName,
        subtitle: `${surah.englishNameTranslation} • ${surah.numberOfAyahs} verses`,
        audioUrl,
        surahNumber
      });
      toast.success(`Playing ${surah.englishName}`);
    }
  };

  const handlePlayVerse = (surahNumber: number, verseNumber: number, audioUrl: string) => {
    const surah = allSurahs.find(s => s.number === surahNumber);
    if (surah) {
      setAudioPlayerData({
        title: `${surah.englishName} - Verse ${verseNumber}`,
        subtitle: surah.englishNameTranslation,
        audioUrl,
        surahNumber,
        verseNumber
      });
    }
  };

  const handleToggleBookmark = (surahNumber: number, verseNumber: number) => {
    const key = `${surahNumber}-${verseNumber}`;
    if (bookmarksSet.has(key)) {
      setBookmarksArray(
        bookmarksArray.filter(
          (b) => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
        )
      );
      toast.info('Bookmark removed');
    } else {
      setBookmarksArray([...bookmarksArray, { surahNumber, verseNumber }]);
      toast.success('Verse bookmarked');
    }
  };

  const handleDeleteBookmark = (surahNumber: number, verseNumber: number) => {
    setBookmarksArray(
      bookmarksArray.filter(
        (b) => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber)
      )
    );
    toast.info('Bookmark removed');
  };

  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const handleNextAudio = () => {
    if (!audioPlayerData) return;
    
    if (audioPlayerData.verseNumber) {
      // Next verse logic would go here
      return;
    }
    
    const nextSurahNumber = audioPlayerData.surahNumber + 1;
    if (nextSurahNumber <= 114) {
      handlePlaySurah(nextSurahNumber);
    }
  };

  const handlePreviousAudio = () => {
    if (!audioPlayerData) return;
    
    if (audioPlayerData.verseNumber) {
      // Previous verse logic would go here
      return;
    }
    
    const prevSurahNumber = audioPlayerData.surahNumber - 1;
    if (prevSurahNumber >= 1) {
      handlePlaySurah(prevSurahNumber);
    }
  };

  const navigationItems = [
    { id: 'home' as View, label: 'Surahs', icon: BookOpen },
    { id: 'bookmarks' as View, label: 'Bookmarks', icon: BookmarkCheck },
    { id: 'prayer' as View, label: 'Prayer Times', icon: Clock },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 border-r bg-muted/30 flex-col">
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id || (view === 'reader' && item.id === 'home');
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setView(item.id);
                    if (item.id === 'home') {
                      setSelectedSurah(null);
                    }
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {item.id === 'bookmarks' && bookmarksArray.length > 0 && (
                    <span className="ml-auto bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">
                      {bookmarksArray.length}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t">
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white space-y-1">
              <p className="text-xs opacity-90">Reading Progress</p>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(bookmarksArray.length / 114) * 100}%` }}
                />
              </div>
              <p className="text-xs opacity-90">
                {bookmarksArray.length} verses bookmarked
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <aside
                className="w-64 h-full bg-background border-r flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="p-3 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = view === item.id || (view === 'reader' && item.id === 'home');
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setView(item.id);
                          if (item.id === 'home') {
                            setSelectedSurah(null);
                          }
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                        {item.id === 'bookmarks' && bookmarksArray.length > 0 && (
                          <span className="ml-auto bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5">
                            {bookmarksArray.length}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {view === 'home' && !selectedSurah && (
              <SurahList
                onSelectSurah={handleSelectSurah}
                onPlaySurah={handlePlaySurah}
                bookmarksCount={bookmarksArray.length}
              />
            )}

            {view === 'reader' && selectedSurah && (
              <SurahReader
                surahNumber={selectedSurah}
                onBack={() => {
                  setSelectedSurah(null);
                  setView('home');
                }}
                fontSize={settings.fontSize}
                translationEnabled={settings.translationEnabled}
                transliterationEnabled={settings.transliterationEnabled}
                bookmarks={bookmarksSet}
                onToggleBookmark={handleToggleBookmark}
                reciter={settings.reciter}
                onPlayVerse={handlePlayVerse}
              />
            )}

            {view === 'bookmarks' && (
              <BookmarksList
                bookmarks={bookmarksArray}
                onSelectBookmark={handleSelectSurah}
                onDeleteBookmark={handleDeleteBookmark}
              />
            )}

            {view === 'prayer' && <PrayerTimes />}

            {view === 'settings' && (
              <SettingsPanel settings={settings} onUpdateSettings={handleUpdateSettings} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <div className="flex items-center justify-around p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id || (view === 'reader' && item.id === 'home');
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                className="flex-col h-auto py-2 relative"
                onClick={() => {
                  setView(item.id);
                  if (item.id === 'home') {
                    setSelectedSurah(null);
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
                {item.id === 'bookmarks' && bookmarksArray.length > 0 && (
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {bookmarksArray.length}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectSurah={(surahNumber) => {
          handleSelectSurah(surahNumber);
          setSearchOpen(false);
        }}
      />

      {/* Audio Player */}
      <AnimatePresence>
        {audioPlayerData && (
          <AudioPlayer
            title={audioPlayerData.title}
            subtitle={audioPlayerData.subtitle}
            audioUrl={audioPlayerData.audioUrl}
            onNext={handleNextAudio}
            onPrevious={handlePreviousAudio}
          />
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
