import React, { useRef } from 'react';
import { 
  Printer as PrinterIcon, 
  Image as ImageIcon, 
  FileText, 
  FolderOpen, 
  Camera, 
  Settings as SettingsIcon, 
  History as HistoryIcon, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Cable, 
  FileCode, 
  Star,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Printer, ActiveScreen } from '../types';

interface HomeScreenProps {
  printer: Printer;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectFileFromSystem: (file: File) => void;
  onOpenCodeViewer: () => void;
  onToggleFrame: () => void;
  isFrameMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  printer,
  onNavigate,
  onSelectFileFromSystem,
  onOpenCodeViewer,
  onToggleFrame,
  isFrameMode
}) => {
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelectFileFromSystem(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Bar with Code Viewer and Frame Switcher */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <PrinterIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight">EasyPrint</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Mobile USB & Network</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Android Code Deliverable Viewer */}
          <button
            onClick={onOpenCodeViewer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
            title="Inspect Android Studio Source Code"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Android Code</span>
          </button>

          {/* Toggle Device Frame */}
          <button
            onClick={onToggleFrame}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isFrameMode ? 'Switch to Fullscreen' : 'Switch to Android Phone View'}
          >
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 max-w-lg mx-auto w-full space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo & Status Header */}
          <div className="text-center pt-2 space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
              <PrinterIcon className="w-8 h-8 text-indigo-400" />
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ready to Print</span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">EasyPrint Mobile</h1>
            </div>
          </div>

          {/* Connected Printer Card */}
          <div
            onClick={() => onNavigate('printer_setup')}
            className="group relative bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <PrinterIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {printer.customName || printer.name}
                    </h2>
                    {printer.isFavorite && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">● Connected</span>
                    <span className="text-xs text-slate-400">• USB OTG</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 text-slate-400 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            {/* Micro Ink Tank Preview */}
            {printer.inkLevels && (
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Epson L120 Ink Tanks:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> BK {printer.inkLevels.black}%
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> C
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-pink-400">
                    <span className="w-2 h-2 rounded-full bg-pink-400" /> M
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Y
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3.5">
            {/* Large Print Photo Button */}
            <button
              onClick={() => onNavigate('print_photo')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-4.5 shadow-xl shadow-indigo-600/25 flex items-center justify-between transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-white">Print Photo</div>
                  <div className="text-xs text-indigo-200">Gallery photos, 4×6 prints & albums</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Large Print Document Button */}
            <button
              onClick={() => onNavigate('print_document')}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white rounded-2xl p-4.5 shadow-lg flex items-center justify-between transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-base font-bold text-white">Print Document</div>
                  <div className="text-xs text-slate-400">PDF, Word, Excel, and text files</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Select File & Scan & Print Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Select File Button */}
              <button
                onClick={() => hiddenFileInputRef.current?.click()}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col items-start gap-2 transition-all active:scale-[0.99] text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Select File</div>
                  <div className="text-[11px] text-slate-400">From Android storage</div>
                </div>
              </button>
              <input 
                ref={hiddenFileInputRef}
                type="file" 
                onChange={handleFileChange}
                className="hidden" 
              />

              {/* Scan & Print Button */}
              <button
                onClick={() => onNavigate('scan_print')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col items-start gap-2 transition-all active:scale-[0.99] text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/20 transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Scan & Print</div>
                  <div className="text-[11px] text-slate-400">Receipts & camera doc</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Shortcuts */}
        <div className="pt-6 pb-2 border-t border-slate-800/80 flex items-center justify-around text-slate-400">
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-900 hover:text-white transition-colors text-xs font-semibold"
          >
            <SettingsIcon className="w-4 h-4 text-indigo-400" />
            <span>Printer Settings</span>
          </button>

          <div className="w-1 h-1 rounded-full bg-slate-800" />

          <button
            onClick={() => onNavigate('history')}
            className="flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-900 hover:text-white transition-colors text-xs font-semibold"
          >
            <HistoryIcon className="w-4 h-4 text-indigo-400" />
            <span>Print History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
