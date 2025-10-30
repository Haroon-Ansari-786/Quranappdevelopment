import { motion, AnimatePresence } from 'motion/react';
import { allSurahs } from '../data/quran-data';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { BookmarkCheck, Trash2, BookOpen } from 'lucide-react';
import { Badge } from './ui/badge';

interface BookmarksListProps {
  bookmarks: Array<{ surahNumber: number; verseNumber: number }>;
  onSelectBookmark: (surahNumber: number) => void;
  onDeleteBookmark: (surahNumber: number, verseNumber: number) => void;
}

export function BookmarksList({ bookmarks, onSelectBookmark, onDeleteBookmark }: BookmarksListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] p-8">
        <BookmarkCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Start reading and bookmark verses to save them for later. Your bookmarks will appear here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-3 p-4">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <BookmarkCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="font-semibold">My Bookmarks</h2>
          <Badge variant="secondary">{bookmarks.length}</Badge>
        </motion.div>

        <AnimatePresence>
          {bookmarks.map(({ surahNumber, verseNumber }, index) => {
            const surah = allSurahs.find((s) => s.number === surahNumber);
            if (!surah) return null;

            return (
              <motion.div
                key={`${surahNumber}-${verseNumber}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm">
                  {surahNumber}:{verseNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold truncate">{surah.englishName}</h3>
                    <span className="font-arabic text-lg shrink-0">{surah.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {surah.englishNameTranslation} • Verse {verseNumber}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectBookmark(surahNumber)}
                    >
                      <BookOpen className="h-3 w-3 mr-2" />
                      Read
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteBookmark(surahNumber, verseNumber)}
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
