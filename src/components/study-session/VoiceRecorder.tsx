import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cleanupResources = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    mediaRecorderRef.current = null;
  };

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        // Clean up resources after processing
        cleanupResources();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer and audio level monitoring
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
        
        if (analyserRef.current && audioContextRef.current?.state === 'running') {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(average / 255);
        }
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      cleanupResources();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    
    // Note: cleanupResources() will be called in the onstop handler
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        {/* Waveform Visualization */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-end space-x-1 h-16">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 bg-pulse-500 rounded-full transition-all duration-150",
                  isRecording
                    ? "animate-pulse"
                    : "opacity-30"
                )}
                style={{
                  height: isRecording 
                    ? `${Math.max(8, audioLevel * 60 + Math.random() * 20)}px`
                    : '8px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </h3>
            <p className="text-gray-600">
              {isRecording 
                ? 'Speak clearly into your microphone'
                : 'Click the button below to start recording your lecture'
              }
            </p>
          </div>

          {/* Timer */}
          {isRecording && (
            <div className="text-2xl font-mono text-pulse-600 font-bold">
              {formatDuration(duration)}
            </div>
          )}

          {/* Record Button */}
          <div className="flex justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-20 h-20 bg-pulse-500 hover:bg-pulse-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Mic className="h-8 w-8 text-white" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Square className="h-8 w-8 text-white" />
              </button>
            )}
          </div>

          {/* Status Text */}
          <div className="text-sm text-gray-500">
            {isRecording ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Recording...</span>
              </div>
            ) : (
              'Click to start recording'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
