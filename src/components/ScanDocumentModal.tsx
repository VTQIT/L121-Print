import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Crop,
  Layers
} from 'lucide-react';
import { PrintableItem } from '../types';

interface ScanDocumentModalProps {
  onBack: () => void;
  onScannedDocumentReady: (item: PrintableItem) => void;
}

export const ScanDocumentModal: React.FC<ScanDocumentModalProps> = ({
  onBack,
  onScannedDocumentReady
}) => {
  const [hasCaptured, setHasCaptured] = useState(false);
  const [filterMode, setFilterMode] = useState<'color' | 'bw' | 'contrast'>('bw');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Try to start camera if allowed
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
          }
        }
      } catch (err) {
        console.log('Camera not available or blocked in iframe, using document scan simulator');
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setHasCaptured(true);
  };

  const handleRetake = () => {
    setHasCaptured(false);
  };

  const handleAcceptScan = () => {
    const scannedDoc: PrintableItem = {
      id: `scan-${Date.now()}`,
      title: `Scanned_Doc_${new Date().toLocaleTimeString().replace(/:/g, '')}`,
      type: 'scan',
      originalFileName: 'Scanned_Document.pdf',
      fileSizeFormatted: '1.1 MB',
      createdAt: 'Just now',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      pages: [
        {
          pageNumber: 1,
          previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
          textSnippet: 'SCANNED DOCUMENT RECEIPT\nDate: September 22, 2026\nCaptured via EasyPrint Camera Scanner\nAuto-enhanced for Epson L120 720DPI black & white print output.\n\nDescription: Official Document Scan\nStatus: Verified'
        }
      ]
    };
    onScannedDocumentReady(scannedDoc);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white">Scan & Print</h1>
            <p className="text-xs text-slate-400">Position document inside frame</p>
          </div>
        </div>

        {hasCaptured && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('bw')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'bw' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              B&W Doc
            </button>
            <button
              onClick={() => setFilterMode('color')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'color' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Color
            </button>
          </div>
        )}
      </div>

      {/* Viewfinder Canvas */}
      <div className="flex-1 bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Document Frame Guide with Corner Crop Reticles */}
        <div className="relative w-full max-w-sm aspect-[1/1.414] rounded-xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl flex items-center justify-center bg-slate-900">
          {/* Edge guides */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-400" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-400" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-400" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-400" />

          {/* Camera View or Captured Image */}
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover ${filterMode === 'bw' && hasCaptured ? 'grayscale contrast-150' : ''}`}
            />
          ) : (
            <div className={`w-full h-full relative flex items-center justify-center ${filterMode === 'bw' && hasCaptured ? 'grayscale contrast-150' : ''}`}>
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                alt="Document Scan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {!hasCaptured && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow">Auto-Detecting Paper Edges</span>
                  <span className="text-[11px] text-slate-300 drop-shadow mt-0.5">Hold phone flat above document</span>
                </div>
              )}
            </div>
          )}

          {/* Scanning Animation Line */}
          {!hasCaptured && (
            <div className="absolute inset-x-0 h-0.5 bg-indigo-400/80 shadow-[0_0_12px_#818cf8] animate-pulse top-1/2" />
          )}
        </div>
      </div>

      {/* Camera Controls Footer */}
      <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-around max-w-lg mx-auto w-full">
        {!hasCaptured ? (
          <button
            onClick={handleCapture}
            className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/30"
          >
            <div className="w-full h-full rounded-full bg-indigo-600 hover:bg-indigo-500" />
          </button>
        ) : (
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            <button
              onClick={handleAcceptScan}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Use Document</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
