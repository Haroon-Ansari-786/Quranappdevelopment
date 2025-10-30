import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';

export function DailyVerse() {
  // Sample daily verse
  const verse = {
    text: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah - He will make for him a way out.',
    reference: 'Surah At-Talaq (65:2)',
    surahNumber: 65,
    verseNumber: 2
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white border-none">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <h3 className="font-semibold">Verse of the Day</h3>
          </div>

          <div className="space-y-3">
            <p className="font-arabic text-2xl text-right leading-loose">
              {verse.text}
            </p>
            <p className="text-sm leading-relaxed opacity-95">
              {verse.translation}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {verse.reference}
            </Badge>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs opacity-75"
            >
              Tap to read full Surah
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
