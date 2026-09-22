import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Clock, 
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { PrintHistoryItem } from '../types';

interface PrintHistoryModalProps {
  history: PrintHistoryItem[];
  onBack: () => void;
  onReprint: (item: PrintHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const PrintHistoryModal: React.FC<PrintHistoryModalProps> = ({
  history,
  onBack,
  onReprint,
  onClearHistory,
  onDeleteItem
}) => {
  const [selectedJob, setSelectedJob] = useState<PrintHistoryItem | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Print History</h1>
            <p className="text-xs text-slate-400">{history.length} completed jobs</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-5 pb-20">
        {history.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No Print History Yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Printed photos and documents will be saved here so you can reprint in one tap.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Previous Print Jobs
            </div>

            {history.map((job) => (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 hover:border-slate-700 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                  {job.title.toLowerCase().endsWith('.jpg') || job.title.toLowerCase().endsWith('.png') ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <h4 className="text-sm font-bold text-white truncate">{job.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-medium">{job.printerName}</span>
                    <span>•</span>
                    <span>{job.pagesCount} {job.pagesCount === 1 ? 'page' : 'pages'}</span>
                    <span>•</span>
                    <span>{job.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => onReprint(job)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                  title="Reprint"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Job Details</h3>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">File Name</span>
                <span className="font-semibold text-white truncate max-w-[180px]">{selectedJob.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Printer</span>
                <span className="font-semibold text-emerald-400">{selectedJob.printerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Pages / Copies</span>
                <span className="font-semibold text-white">{selectedJob.pagesCount} pages, {selectedJob.copies} copy</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Paper / Mode</span>
                <span className="font-semibold text-white uppercase">{selectedJob.paperSize} • {selectedJob.colorMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Timestamp</span>
                <span className="font-semibold text-white">{selectedJob.timestamp}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => {
                  onDeleteItem(selectedJob.id);
                  setSelectedJob(null);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete Job"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onReprint(selectedJob);
                  setSelectedJob(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reprint Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
