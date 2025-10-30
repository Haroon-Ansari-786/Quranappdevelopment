import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Search, BookOpen } from 'lucide-react';
import { allSurahs } from '../data/quran-data';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSurah: (surahNumber: number) => void;
}

export function SearchDialog({ open, onOpenChange, onSelectSurah }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: 'surah' | 'verse';
      surahNumber: number;
      surahName: string;
      verseNumber?: number;
      text?: string;
      translation?: string;
    }> = [];

    // Search in surah names
    allSurahs.forEach((surah) => {
      if (
        surah.name.includes(query) ||
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
      ) {
        results.push({
          type: 'surah',
          surahNumber: surah.number,
          surahName: `${surah.englishName} (${surah.name})`,
        });
      }
    });

    // Note: Verse search is limited to surah names only in this implementation
    // For full verse search, integrate with a Quran API

    return results.slice(0, 20);
  };

  const results = searchResults();

  const handleSelect = (surahNumber: number) => {
    onSelectSurah(surahNumber);
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Quran</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by surah name, verse, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <ScrollArea className="h-[400px] mt-4">
          {results.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}

          {results.length === 0 && !searchQuery && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Start typing to search surahs and verses
              </p>
            </div>
          )}

          <div className="space-y-2">
            {results.map((result, index) => (
              <Card
                key={`${result.type}-${result.surahNumber}-${result.verseNumber || 0}-${index}`}
                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleSelect(result.surahNumber)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs">
                    {result.type === 'verse'
                      ? `${result.surahNumber}:${result.verseNumber}`
                      : result.surahNumber}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{result.surahName}</span>
                      <Badge variant={result.type === 'verse' ? 'secondary' : 'default'}>
                        {result.type === 'verse' ? 'Verse' : 'Surah'}
                      </Badge>
                    </div>

                    {result.type === 'verse' && (
                      <>
                        {result.text && (
                          <p className="font-arabic text-sm text-right">
                            {result.text.slice(0, 100)}
                            {result.text.length > 100 && '...'}
                          </p>
                        )}
                        {result.translation && (
                          <p className="text-xs text-muted-foreground">
                            {result.translation.slice(0, 150)}
                            {result.translation.length > 150 && '...'}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
