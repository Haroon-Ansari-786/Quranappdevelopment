import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2
} from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlayerProps {
  title: string;
  subtitle: string;
  audioUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function AudioPlayer({ title, subtitle, audioUrl, onNext, onPrevious }: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    play,
    pause,
    seek,
    changeVolume
  } = useAudioPlayer();

  useEffect(() => {
    if (audioUrl) {
      play(audioUrl);
    }
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play(audioUrl);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 md:bottom-4 left-4 right-4 z-40"
    >
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-2xl">
        <div className="p-4 space-y-4">
          {/* Title and Subtitle */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{title}</h4>
              <p className="text-sm opacity-90 truncate">{subtitle}</p>
            </div>
            {loading && <Loader2 className="h-5 w-5 animate-spin ml-3" />}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={([value]) => seek(value)}
              className="cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs opacity-90">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                disabled={!onPrevious}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                onClick={handlePlayPause}
                disabled={loading}
                className="bg-white text-emerald-600 hover:bg-white/90 h-12 w-12"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={!onNext}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeVolume(volume > 0 ? 0 : 1)}
                className="text-white hover:bg-white/20"
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => changeVolume(value / 100)}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
