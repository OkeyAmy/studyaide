
import React, { useState, useRef } from 'react';
import { Upload, Mic, FileText, Video, AudioLines, File } from 'lucide-react';
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
        <div className="pulse-chip mb-4 inline-flex">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">📚</span>
          <span>Start Your Study Session</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Your Learning Materials
        </h1>
        <p className="text-gray-600 text-lg">
          Drop your files or record live—AI will fold them into study magic
        </p>
      </div>

      {/* Recording Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 bg-white rounded-full p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setIsRecording(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              !isRecording
                ? "bg-pulse-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Upload Files
          </button>
          <button
            onClick={() => setIsRecording(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
              isRecording
                ? "bg-pulse-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Record Live
          </button>
        </div>
      </div>

      {/* Main Interface */}
      {!isRecording ? (
        <div className="max-w-2xl mx-auto">
          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 bg-white",
              isDragging
                ? "border-pulse-500 bg-pulse-50 shadow-lg scale-105"
                : "border-gray-300 hover:border-pulse-400 hover:bg-gray-50"
            )}
            style={{
              backgroundImage: isDragging ? 'url("data:image/svg+xml,%3csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cg fill=\'none\' fill-rule=\'evenodd\'%3e%3cg fill=\'%23FE5C02\' fill-opacity=\'0.05\'%3e%3cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")' : undefined
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.mp4,.mov,.pdf,.docx,.pptx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-6">
              {/* Icon Stack */}
              <div className="flex justify-center space-x-4">
                <div className="w-16 h-16 bg-pulse-100 rounded-full flex items-center justify-center">
                  <AudioLines className="h-8 w-8 text-pulse-600" />
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <File className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragging ? "Drop it like it's hot!" : "Drag & Drop or Click to Upload"}
                </h3>
                <p className="text-gray-500">
                  MP3, WAV, MP4, PDF, DOCX, PPTX
                </p>
              </div>
            </div>

            {/* Crinkle effect on hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pulse-100/20 rounded-2xl transition-opacity duration-300",
              isDragging ? "opacity-100" : "opacity-0"
            )} />
          </div>

          {/* Supported Formats */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Supported formats: Audio (MP3, WAV), Video (MP4, MOV), Documents (PDF, DOCX, PPTX)
            </p>
          </div>
        </div>
      ) : (
        <VoiceRecorder onRecordingComplete={onAudioRecord} />
      )}
    </div>
  );
};

export default UploadInterface;
