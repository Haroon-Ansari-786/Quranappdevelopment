import { motion } from 'motion/react';
import { allSurahs } from '../data/quran-data';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { BookOpen, MapPin, Play } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { DailyVerse } from './DailyVerse';
import { Statistics } from './Statistics';

interface SurahListProps {
  onSelectSurah: (surahNumber: number) => void;
  onPlaySurah?: (surahNumber: number) => void;
  searchQuery?: string;
  bookmarksCount?: number;
}

export function SurahList({ onSelectSurah, onPlaySurah, searchQuery = '', bookmarksCount = 0 }: SurahListProps) {
  const filteredSurahs = allSurahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
  );

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-4 p-4">
        {!searchQuery && (
          <>
            <DailyVerse />
            <Statistics
              totalRead={12}
              bookmarksCount={bookmarksCount}
              readingTime={45}
              streak={7}
            />
          </>
        )}

        <div className="space-y-3">
          {filteredSurahs.map((surah, index) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer transition-all hover:shadow-lg hover:border-emerald-500/50 group"
                onClick={() => onSelectSurah(surah.number)}
              >
                <div className="flex items-center gap-4 p-4">
                  <motion.div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span>{surah.number}</span>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate group-hover:text-emerald-600 transition-colors">
                        {surah.englishName}
                      </h3>
                      <span className="font-arabic text-xl shrink-0">{surah.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span className="truncate">{surah.englishNameTranslation}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{surah.numberOfAyahs} verses</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onPlaySurah && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlaySurah(surah.number);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge
                      variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {surah.revelationType}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
