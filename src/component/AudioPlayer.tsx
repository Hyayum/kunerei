import { useRef, useEffect, useState } from "react";
import { Box, IconButton, LinearProgress } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

type Props = {
  src: string;
  playing: boolean;
  onClick: () => void;
};

const AudioPlayer = ({ src, playing, onClick }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleEnded = () => {
    onClick();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (playing) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    playingRef.current = playing;
    setCurrentTime(audioRef.current?.currentTime || 0);
  }, [playing]);

  useEffect(() => {
    setInterval(() => {
      if (playingRef.current) {
        setCurrentTime(audioRef.current?.currentTime || 0);
      }
    }, 500);
  }, [])

  return (
    <>
      <audio
        src={src}
        preload="none"
        ref={audioRef}
        style={{ display: "none" }}
        onEnded={handleEnded}
      />
      <Box sx={{ display: "flex" }}>
        <IconButton onClick={onClick} sx={{ ml: -2 }}>
          <>
            {playing ? (
              <Pause />
            ) : (
              <PlayArrow />
            )}
          </>
        </IconButton>
        <LinearProgress
          variant="determinate"
          value={100 * currentTime / (audioRef.current?.duration || 1)}
          sx={{ width: 80, height: 8, mt: 2 }}
        />
      </Box>
    </>
  );
};

export default AudioPlayer;