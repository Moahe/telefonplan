"use client";
import React, { useEffect, useRef, useState } from "react";

interface SoundPlayerProps {
  audioFile: string;
  children: React.ReactNode;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ audioFile, children }) => {
  const audio = useRef<HTMLAudioElement | undefined>();

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.current =
      typeof Audio !== "undefined" ? new Audio(audioFile) : undefined;
  }, [audioFile]);

  const togglePlay = (): void => {
    if (isPlaying) {
      audio.current?.pause();
      setIsPlaying(false);
    } else {
      audio.current?.play();
      setIsPlaying(true);
    }
  };

  return <div onClick={togglePlay}>{children}</div>;
};

export default SoundPlayer;
