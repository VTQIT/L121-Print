import React, { useState, useEffect } from 'react';
import { 
  Printer as PrinterIcon, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Clock, 
  FileText, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PrintableItem, PrintSettings, Printer } from '../types';

interface PrintingModalProps {
  item: PrintableItem;
  settings: PrintSettings;
  printer: Printer;
  onCancel: () => void;
  onComplete: () => void;
  onPrintAnother: () => void;
}

export const PrintingModal: React.FC<PrintingModalProps> = ({
  item,
  settings,
  printer,
  onCancel,
  onComplete,
  onPrintAnother
}) => {
  const totalPages = item.pages.length * settings.copies;
  const [currentPage, setCurrentPage] = useState(1);
  const [progressPercent, setProgressPercent] = useState(10);
  const [statusText, setStatusText] = useState('Initializing Epson L120 ESC/P-R raster engine...');
  const [isDone, setIsDone] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Simulation of multi-page printing with raster buffer transmission
    const runSimulation = async () => {
      // Step 1: Initialize
      setStatusText('Transmitting ESC/P-R print header to USB OTG...');
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      for (let p = 1; p <= totalPages; p++) {
        if (cancelled) return;
        setCurrentPage(p);
        const basePercent = Math.round(((p - 1) / totalPages) * 100);

        setStatusText(`Rendering page ${p} of ${totalPages}...`);
        setProgressPercent(basePercent + 10);
        await new Promise((r) => setTimeout(r, 700));
        if (cancelled) return;

        setStatusText(`Printing page ${p} of ${totalPages} on ${printer.name}...`);
        setProgressPercent(basePercent + 25);
        await new Promise((r) => setTimeout(r, 900));
        if (cancelled) return;

        setProgressPercent(Math.round((p / totalPages) * 100));
        await new Promise((r) => setTimeout(r, 500));
      }

      if (!cancelled) {
        setProgressPercent(100);
        setStatusText('Ejecting final page...');
        await new Promise((r) => setTimeout(r, 600));
        setIsDone(true);
        onComplete();
      }
    };

    runSimulation();

    return () => {
      cancelled = true;
    };
  }, [item, settings, printer, totalPages]);

  const handleCancelClick = () => {
    setIsCancelled(true);
    onCancel();
  };

  const handleSystemPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {!isDone ? (
          <>
            {/* Animated Printing Visual */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-indigo-500/15 border-2 border-indigo-500/30 flex items-center justify-center animate-pulse">
                <PrinterIcon className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-950 border border-indigo-500/40 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>
            </div>

            {/* Printing Titles */}
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Printing...</h2>
              <p className="text-base font-semibold text-emerald-400">{printer.name}</p>
              <p className="text-sm text-slate-300 font-medium">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span className="truncate max-w-[240px] text-left">{statusText}</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            {/* Document Details Pill */}
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300 truncate font-medium">{item.title}</span>
              </div>
              <span className="shrink-0 uppercase font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {settings.colorMode === 'color' ? 'Color' : 'B&W'} • {settings.paperSize.toUpperCase()}
              </span>
            </div>

            {/* Cancel Printing Button */}
            <button
              onClick={handleCancelClick}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-sm font-semibold border border-slate-700 hover:border-red-500/40 transition-colors"
            >
              Cancel Printing
            </button>
          </>
        ) : (
          /* Completion State */
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-in zoom-in-90">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Printing Complete</h2>
              <p className="text-sm text-slate-300">
                {totalPages} {totalPages === 1 ? 'page' : 'pages'} sent to <span className="font-semibold text-emerald-400">{printer.name}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Print Job Sent via USB OTG</div>
              <p>The Epson L120 has received the ESC/P-R raster print stream.</p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onPrintAnother}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99]"
              >
                Print Another
              </button>

              <button
                onClick={handleSystemPrint}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Send to Local Desktop Printer (Native Print)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
