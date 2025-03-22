
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VoiceRecorderProps = {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioURL;
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  }, [audioBlob]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="voice-recorder glass p-3 rounded-xl mt-2 animate-fade-in">
      <audio ref={audioRef} />
      
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Voice Message</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onCancel}
        >
          ✕
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {!audioBlob ? (
          <>
            <div className="recording-time text-sm">
              {formatTime(recordingTime)}
            </div>
            
            <div className="recording-indicator flex-1">
              <div className={`h-8 relative rounded-full overflow-hidden ${isRecording ? 'bg-red-100 dark:bg-red-900/30' : 'bg-secondary'}`}>
                {isRecording && (
                  <div className="absolute left-0 top-0 h-full bg-red-500/30 animate-pulse" style={{ width: `${Math.min(recordingTime * 5, 100)}%` }}></div>
                )}
              </div>
            </div>
            
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={isPlaying ? handlePause : handlePlay}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <div className="audio-waveform flex-1 h-8 bg-secondary rounded-full overflow-hidden">
              <div className="waveform-visualization h-full w-full flex items-center justify-around px-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="waveform-bar w-1 bg-primary"
                    style={{ 
                      height: `${30 + Math.sin(i / 3) * 70}%`,
                      opacity: isPlaying ? 1 : 0.5
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleSend}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-full"
            >
              Send
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
