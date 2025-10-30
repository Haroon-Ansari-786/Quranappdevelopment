import { motion } from 'motion/react';
import { Card } from './ui/card';
import { BookOpen, BookmarkCheck, Clock, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  totalRead: number;
  bookmarksCount: number;
  readingTime: number;
  streak: number;
}

export function Statistics({ totalRead, bookmarksCount, readingTime, streak }: StatisticsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: 'Surahs Read',
      value: totalRead,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookmarkCheck,
      label: 'Bookmarks',
      value: bookmarksCount,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Clock,
      label: 'Reading Time',
      value: `${readingTime}m`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Day Streak',
      value: streak,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
