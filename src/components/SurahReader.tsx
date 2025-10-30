import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { allSurahs, fetchSurahVerses, getVerseAudioUrl } from '../data/quran-data';
import { Surah, Verse } from '../types/quran';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  Info,
  Share2,
  Copy,
  Check,
  Loader2,
  Volume2
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';
import { Skeleton } from './ui/skeleton';

interface SurahReaderProps {
  surahNumber: number;
  onBack: () => void;
  fontSize: number;
  translationEnabled: boolean;
  transliterationEnabled: boolean;
  bookmarks: Set<string>;
  onToggleBookmark: (surahNumber: number, verseNumber: number) => void;
  reciter: string;
  onPlayVerse?: (surahNumber: number, verseNumber: number, audioUrl: string) => void;
}

export function SurahReader({
  surahNumber,
  onBack,
  fontSize,
  translationEnabled,
  transliterationEnabled,
  bookmarks,
  onToggleBookmark,
  reciter,
  onPlayVerse
}: SurahReaderProps) {
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const loadSurah = async () => {
      setLoading(true);
      const foundSurah = allSurahs.find((s) => s.number === surahNumber);
      setSurah(foundSurah || null);

      if (foundSurah) {
        const loadedVerses = await fetchSurahVerses(surahNumber);
        setVerses(loadedVerses);
      }
      
      setLoading(false);
    };

    loadSurah();
  }, [surahNumber]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    const scrollElement = document.querySelector('[data-radix-scroll-area-viewport]');
    scrollElement?.addEventListener('scroll', handleScroll);

    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePlayVerse = (verseNumber: number) => {
    const audioUrl = getVerseAudioUrl(surahNumber, verseNumber, reciter);
    
    if (playingVerse === verseNumber) {
      setPlayingVerse(null);
      toast.info('Audio paused');
    } else {
      setPlayingVerse(verseNumber);
      if (onPlayVerse) {
        onPlayVerse(surahNumber, verseNumber, audioUrl);
      }
      toast.success(`Playing verse ${verseNumber}`);
    }
  };

  const handleCopyVerse = (verse: Verse) => {
    const text = `${verse.text}\n${verse.translation}\nSurah ${surah?.englishName} (${surah?.number}:${verse.numberInSurah})`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(verse.numberInSurah);
    toast.success('Verse copied to clipboard');
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleShareVerse = (verse: Verse) => {
    if (navigator.share) {
      navigator.share({
        title: `Surah ${surah?.englishName}`,
        text: `${verse.text}\n${verse.translation}\n\nSurah ${surah?.englishName} (${surah?.number}:${verse.numberInSurah})`
      });
    } else {
      handleCopyVerse(verse);
    }
  };

  if (!surah) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Surah not available</p>
          <Button onClick={onBack} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Reading Progress Bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{surah.englishName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {surah.englishNameTranslation}
                  </p>
                </div>
                <span className="font-arabic text-2xl">{surah.name}</span>
              </div>
            </div>
          </motion.div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {surah.numberOfAyahs} verses
            </Badge>
            <Badge variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'}>
              {surah.revelationType}
            </Badge>
            {loading && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading verses...
              </Badge>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container max-w-4xl p-4 space-y-6">
          {surah.number !== 1 && surah.number !== 9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <p className="font-arabic text-3xl text-emerald-600 dark:text-emerald-400">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-20 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4" />
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {verses.map((verse, index) => {
                const bookmarkKey = `${surahNumber}-${verse.numberInSurah}`;
                const isBookmarked = bookmarks.has(bookmarkKey);

                return (
                  <motion.div
                    key={verse.numberInSurah}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all group">
                      <div className="flex items-start gap-3 mb-4">
                        <motion.div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          {verse.numberInSurah}
                        </motion.div>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePlayVerse(verse.numberInSurah)}
                          >
                            {playingVerse === verse.numberInSurah ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              >
                                <Volume2 className="h-4 w-4 text-emerald-600" />
                              </motion.div>
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onToggleBookmark(surahNumber, verse.numberInSurah)}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="h-4 w-4 fill-current text-emerald-600" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </motion.div>
                          </Button>
                          {verse.tafsir && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-semibold">Tafsir</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {verse.tafsir}
                                  </p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyVerse(verse)}
                          >
                            {copiedVerse === verse.numberInSurah ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleShareVerse(verse)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <motion.p
                          className="font-arabic text-right leading-loose"
                          style={{ fontSize: `${fontSize}px` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {verse.text}
                        </motion.p>

                        {transliterationEnabled && verse.transliteration && (
                          <>
                            <Separator />
                            <motion.p
                              className="text-sm italic text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {verse.transliteration}
                            </motion.p>
                          </>
                        )}

                        {translationEnabled && (
                          <>
                            <Separator />
                            <motion.p
                              className="text-sm leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {verse.translation}
                            </motion.p>
                          </>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {!loading && verses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
                <p className="text-sm text-muted-foreground mb-2">
                  You've reached the end of Surah {surah.englishName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {verses.length} verses • {surah.revelationType}
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
