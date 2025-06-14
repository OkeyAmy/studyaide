import React from 'react';
import { Eye, ExternalLink, FileType, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilePreviewerProps {
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  isLoading?: boolean;
  loadError?: boolean;
}

const FilePreviewer: React.FC<FilePreviewerProps> = ({
  fileUrl,
  fileName = 'File',
  fileType = 'unknown',
  isLoading = false,
  loadError = false,
}) => {
  const handleClick = () => {
    if (!isLoading) {
      window.open(fileUrl, '_blank');
    }
  };

  // Get appropriate file icon based on type
  const getFileEmoji = () => {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '🎞️';
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'svg': return '🖼️';
      case 'mp3': case 'wav': case 'ogg': return '🎵';
      case 'mp4': case 'avi': case 'mov': case 'webm': return '🎬';
      case 'audio': case 'video': return '🎬';
      case 'zip': case 'rar': return '🗃️';
      default: return '📁';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-100/50"></div>
        
        <div className="relative h-full flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative w-24 h-24 bg-gradient-to-br from-orange-200 to-amber-300 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-white/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer"></div>
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
          
          <div className="space-y-3 max-w-xs">
            <h3 className="text-xl font-bold text-orange-900">Loading {getFileEmoji()}</h3>
            <p className="text-orange-700/80 text-sm">
              Preparing your file for preview...
            </p>
            <div className="flex justify-center w-full space-x-1.5 pt-2">
              <div className="h-1.5 w-16 bg-gradient-to-r from-orange-200 to-amber-300 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error/Can't render state
  if (loadError) {
    return (
      <div 
        onClick={handleClick}
        className="relative h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.01] group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-red-500/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400/80 to-red-400/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Can't Preview this File</h3>
          <p className="text-white/80 mb-6 max-w-xs">
            This file format can't be previewed in the browser, but you can still access it.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
            <ExternalLink className="h-5 w-5" />
            <span className="font-medium">Open File</span>
          </div>
        </div>
      </div>
    );
  }

  // Default state (shouldn't be shown normally, as parent would render content instead)
  return (
    <div 
      onClick={handleClick}
      className="relative h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.01] group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-amber-500/80 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-300/80 to-amber-400/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all">
          <Eye className="h-12 w-12 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{fileName}</h3>
        <p className="text-white/80 mb-6">
          Click to open this file in a new tab
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
          <ExternalLink className="h-5 w-5" />
          <span className="font-medium">Open File</span>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewer;
