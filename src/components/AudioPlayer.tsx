"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  audioUrl: string;
  fileName?: string;
}

export default function AudioPlayer({ audioUrl, fileName }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = fileName || "audio.webm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
      />

      <Button
        type="button"
        size="sm"
        onClick={handlePlayPause}
        className="rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white h-8 w-8"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-1.5">
          <motion.div
            className="bg-linear-to-r from-purple-500 to-purple-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: duration ? `${(currentTime / duration) * 100}%` : 0,
            }}
          />
        </div>
        <p className="text-xs opacity-75">{`${formatTime(
          currentTime
        )} / ${formatTime(duration)}`}</p>
      </div>

      <Button
        type="button"
        size="sm"
        onClick={handleDownload}
        className="rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white h-8 w-8"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
