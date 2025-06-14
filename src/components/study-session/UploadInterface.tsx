import React, { useState, useRef } from 'react';
import { Upload, Mic, FileText, Video, AudioLines, File, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoiceRecorder from './VoiceRecorder';

interface UploadInterfaceProps {
  onFileUpload: (file: File) => void;
  onAudioRecord: (audioBlob: Blob) => void;
}

const UploadInterface = ({ onFileUpload, onAudioRecord }: UploadInterfaceProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pulse-100/80 to-orange-100/80 backdrop-blur-sm text-pulse-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-pulse-200/50 shadow-lg">
          <div className="w-5 h-5 bg-gradient-to-r from-pulse-500 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span>Start Your Study Session</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pulse-600 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Upload Your Learning Materials
        </h1>
        <p className="text-gray-700 text-xl font-medium">
          Drop your files or record live—AI will fold them into study magic ✨
        </p>
      </div>

      {/* Recording Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-sm rounded-full p-1.5 shadow-xl border border-white/30">
          <button
            onClick={() => setIsRecording(false)}
            className={cn(
              "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden",
              !isRecording
                ? "bg-gradient-to-r from-pulse-500 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transform"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            {!isRecording && (
              <div className="absolute inset-0 bg-gradient-to-r from-pulse-400 to-orange-400 opacity-0 hover:opacity-20 transition-opacity duration-300" />
            )}
            <Upload className="h-4 w-4 mr-2 inline" />
            Upload Files
          </button>
          <button
            onClick={() => setIsRecording(true)}
            className={cn(
              "px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden",
              isRecording
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transform"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            )}
          >
            {isRecording && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 hover:opacity-20 transition-opacity duration-300" />
            )}
            <Mic className="h-4 w-4 mr-2 inline" />
            Record Live
          </button>
        </div>
      </div>

      {/* Main Interface */}
      {!isRecording ? (
        <div className="max-w-3xl mx-auto">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              "relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-500 group",
              isDragging
                ? "border-pulse-400 bg-gradient-to-br from-pulse-50/80 to-orange-50/80 backdrop-blur-sm shadow-2xl scale-105 transform"
                : "border-white/40 bg-white/40 backdrop-blur-sm hover:border-pulse-300 hover:bg-white/60 hover:shadow-xl hover:scale-102 transform shadow-lg"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.mp4,.mov,.pdf,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-8">
              {/* Floating Icon Stack */}
              <div className="flex justify-center space-x-6">
                <div className={cn(
                  "w-20 h-20 bg-gradient-to-r from-pulse-100 to-orange-100 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-pulse-200/50 shadow-lg",
                  isDragging ? "animate-bounce" : "group-hover:scale-110 group-hover:rotate-3"
                )}>
                  <AudioLines className="h-10 w-10 text-pulse-600" />
                </div>
                <div className={cn(
                  "w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-blue-200/50 shadow-lg",
                  isDragging ? "animate-bounce" : "group-hover:scale-110 group-hover:-rotate-3"
                )} style={{ animationDelay: '0.1s' }}>
                  <Video className="h-10 w-10 text-blue-600" />
                </div>
                <div className={cn(
                  "w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-green-200/50 shadow-lg",
                  isDragging ? "animate-bounce" : "group-hover:scale-110 group-hover:rotate-2"
                )} style={{ animationDelay: '0.2s' }}>
                  <FileText className="h-10 w-10 text-green-600" />
                </div>
                <div className={cn(
                  "w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 border border-purple-200/50 shadow-lg",
                  isDragging ? "animate-bounce" : "group-hover:scale-110 group-hover:-rotate-2"
                )} style={{ animationDelay: '0.3s' }}>
                  <File className="h-10 w-10 text-purple-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className={cn(
                  "w-16 h-16 bg-gradient-to-r from-pulse-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl transition-all duration-300",
                  isDragging ? "animate-pulse scale-110" : "group-hover:scale-110 group-hover:rotate-12"
                )}>
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-pulse-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    {isDragging ? "Drop it like it's hot! 🔥" : "Drag & Drop or Click to Upload"}
                  </h3>
                  <p className="text-gray-600 font-medium">
                    MP3, WAV, MP4, PDF, TXT — All welcome here!
                  </p>
                </div>
              </div>
            </div>

            {/* Animated background effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-pulse-300/10 via-orange-300/10 to-pink-300/10 rounded-3xl transition-all duration-500 pointer-events-none",
              isDragging ? "opacity-100 animate-pulse" : "opacity-0 group-hover:opacity-50"
            )} />
            
            {/* Sparkle effect */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-300",
              isDragging ? "opacity-100" : "opacity-0"
            )}>
              <div className="absolute top-4 left-8 w-2 h-2 bg-pulse-400 rounded-full animate-ping" />
              <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-8 left-16 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-16 right-8 w-2.5 h-2.5 bg-pulse-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/30">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pulse-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Audio (MP3, WAV) • Video (MP4, MOV) • Documents (PDF, TXT)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <VoiceRecorder onRecordingComplete={onAudioRecord} />
      )}
    </div>
  );
};

export default UploadInterface;
