import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

interface PrayerTime {
  name: string;
  time: string;
  passed: boolean;
}

export function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('New York, USA');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock prayer times - in a real app, these would be calculated based on location
  const prayerTimes: PrayerTime[] = [
    { name: 'Fajr', time: '05:30 AM', passed: currentTime.getHours() >= 5 && currentTime.getMinutes() >= 30 },
    { name: 'Sunrise', time: '07:15 AM', passed: currentTime.getHours() >= 7 && currentTime.getMinutes() >= 15 },
    { name: 'Dhuhr', time: '12:45 PM', passed: currentTime.getHours() >= 12 && currentTime.getMinutes() >= 45 },
    { name: 'Asr', time: '04:00 PM', passed: currentTime.getHours() >= 16 },
    { name: 'Maghrib', time: '06:30 PM', passed: currentTime.getHours() >= 18 && currentTime.getMinutes() >= 30 },
    { name: 'Isha', time: '08:00 PM', passed: currentTime.getHours() >= 20 },
  ];

  const nextPrayer = prayerTimes.find((prayer) => !prayer.passed);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="p-4 space-y-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-semibold text-xl">Prayer Times</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(currentTime)}</span>
          </div>
        </motion.div>

        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Clock className="h-6 w-6" />
                </motion.div>
                <div>
                  <p className="text-sm opacity-90">Next Prayer</p>
                  <h3 className="text-2xl font-semibold">{nextPrayer.name}</h3>
                </div>
              </div>
              <motion.p
                className="text-3xl font-bold"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {nextPrayer.time}
              </motion.p>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Today's Schedule</h3>
            <div className="space-y-3">
              {prayerTimes.map((prayer, index) => (
                <motion.div
                  key={prayer.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    prayer.passed
                      ? 'bg-muted/50 opacity-60'
                      : 'bg-emerald-50 dark:bg-emerald-950/30'
                  }`}
                >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    prayer.passed ? 'bg-muted-foreground' : 'bg-emerald-600'
                  }`} />
                  <span className="font-medium">{prayer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{prayer.time}</span>
                  {prayer.passed && (
                    <Badge variant="secondary" className="text-xs">
                      Passed
                    </Badge>
                  )}
                </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Prayer Reminders</h4>
              <p className="text-xs text-muted-foreground">
                Enable notifications to get reminders before each prayer time.
              </p>
            </div>
          </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4">
          <h3 className="font-semibold mb-3">Qibla Direction</h3>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="relative h-32 w-32">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-2 rounded-full border-2 border-emerald-400" />
              <div className="absolute inset-4 rounded-full border border-emerald-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">⇧</div>
                  <p className="text-xs mt-1">Qibla</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">045°</p>
              <p className="text-xs text-muted-foreground">Northeast</p>
            </div>
          </div>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
