import audioFile from "../assets/female-female-mixture.wav";
import { useEffect, useRef, useState } from "react";

const AudioVisualizer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSrc, setAudioSrc] = useState<string>("");

  useEffect(() => {
    setAudioSrc(audioFile);
  }, []);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
    }
    const audioContext = audioContextRef.current;

    if (!analyserRef.current) {
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    const analyser = analyserRef.current;

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!isPlaying) return;

      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bufferLength; // Fit bars within canvas width
      const maxBarHeight = canvas.height * 0.9; // Scale bars relative to canvas height

      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * maxBarHeight; // Normalize height

        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 100)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 2; // Add spacing between bars
      }

      requestAnimationFrame(draw);
    };

    if (isPlaying) {
      audioContext.resume();
      draw();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {audioSrc && <audio ref={audioRef} src={audioSrc} />}
      <canvas ref={canvasRef} width={window.innerWidth * 0.7} height={150} style={{ background: "#111", borderRadius: "10px" }} />
      <br />
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
};

export default AudioVisualizer;
