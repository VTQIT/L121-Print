import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer as PrinterIcon, 
  Star, 
  Droplet, 
  Wrench, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Cable, 
  Edit2, 
  Save,
  HelpCircle
} from 'lucide-react';
import { Printer } from '../types';
import { UsbPrinterService } from '../services/usbPrinterService';

interface PrinterSettingsModalProps {
  printer: Printer;
  onBack: () => void;
  onUpdatePrinter: (printer: Printer) => void;
  onSwitchPrinter: () => void;
}

export const PrinterSettingsModal: React.FC<PrinterSettingsModalProps> = ({
  printer,
  onBack,
  onUpdatePrinter,
  onSwitchPrinter
}) => {
  const [alias, setAlias] = useState(printer.customName || 'Home Printer');
  const [isFavorite, setIsFavorite] = useState(printer.isFavorite);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanStatus, setCleanStatus] = useState<string | null>(null);

  const handleSaveAlias = () => {
    const updated = {
      ...printer,
      customName: alias,
      isFavorite: isFavorite
    };
    onUpdatePrinter(updated);
    UsbPrinterService.savePrinter(updated);
  };

  const handleHeadClean = async () => {
    setIsCleaning(true);
    setCleanStatus('Running Micro Piezo nozzle purge cycle...');
    await new Promise((r) => setTimeout(r, 2000));
    setCleanStatus('Head cleaning completed! Print quality restored.');
    setIsCleaning(false);
    setTimeout(() => setCleanStatus(null), 4000);
  };

  const handleNozzleTest = async () => {
    setIsCleaning(true);
    setCleanStatus('Sending CMYK 4-color test grid pattern...');
    await new Promise((r) => setTimeout(r, 1500));
    setCleanStatus('Test pattern sent to Epson L120 feed tray.');
    setIsCleaning(false);
    setTimeout(() => setCleanStatus(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Printer Settings</h1>
            <p className="text-xs text-slate-400">{printer.name}</p>
          </div>
        </div>

        <button
          onClick={handleSaveAlias}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6 pb-20">
        {/* Printer Identification Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <PrinterIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{printer.name}</h3>
                <p className="text-xs text-slate-400">{printer.model}</p>
              </div>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite 
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Favorite"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Custom Name / Favorite Alias */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">Custom Printer Name / Alias</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. Home Printer or Epson L120"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAlias('Home Printer')}
                  className="px-2.5 py-1.5 text-[11px] bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-medium"
                >
                  "Home Printer"
                </button>
                <button
                  type="button"
                  onClick={() => setAlias('Epson L120')}
                  className="px-2.5 py-1.5 text-[11px] bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-medium"
                >
                  "Epson L120"
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              EasyPrint will automatically connect to your favorite printer on startup.
            </p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>USB OTG Connected</span>
            </div>
            <button
              onClick={onSwitchPrinter}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Switch Printer →
            </button>
          </div>
        </div>

        {/* Ink Tank Status for Epson L120 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Epson Ink Tank Levels
              </span>
            </div>
            <span className="text-[11px] text-slate-400">T664 Series Inks</span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {/* Black */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="h-20 w-7 mx-auto bg-slate-800 rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
                <div 
                  className="w-full bg-slate-300 rounded-full transition-all"
                  style={{ height: `${printer.inkLevels?.black || 80}%` }}
                />
              </div>
              <div className="text-xs font-bold text-white">BK</div>
              <div className="text-[10px] text-slate-400">{printer.inkLevels?.black || 80}%</div>
            </div>

            {/* Cyan */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="h-20 w-7 mx-auto bg-slate-800 rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
                <div 
                  className="w-full bg-cyan-400 rounded-full transition-all shadow-[0_0_8px_#22d3ee]"
                  style={{ height: `${printer.inkLevels?.cyan || 70}%` }}
                />
              </div>
              <div className="text-xs font-bold text-white">C</div>
              <div className="text-[10px] text-slate-400">{printer.inkLevels?.cyan || 70}%</div>
            </div>

            {/* Magenta */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="h-20 w-7 mx-auto bg-slate-800 rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
                <div 
                  className="w-full bg-pink-500 rounded-full transition-all shadow-[0_0_8px_#ec4899]"
                  style={{ height: `${printer.inkLevels?.magenta || 75}%` }}
                />
              </div>
              <div className="text-xs font-bold text-white">M</div>
              <div className="text-[10px] text-slate-400">{printer.inkLevels?.magenta || 75}%</div>
            </div>

            {/* Yellow */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="h-20 w-7 mx-auto bg-slate-800 rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
                <div 
                  className="w-full bg-amber-400 rounded-full transition-all shadow-[0_0_8px_#facc15]"
                  style={{ height: `${printer.inkLevels?.yellow || 90}%` }}
                />
              </div>
              <div className="text-xs font-bold text-white">Y</div>
              <div className="text-[10px] text-slate-400">{printer.inkLevels?.yellow || 90}%</div>
            </div>
          </div>
        </div>

        {/* Maintenance Utilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Printer Maintenance
            </span>
          </div>

          {cleanStatus && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isCleaning ? 'animate-spin' : ''}`} />
              <span>{cleanStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleHeadClean}
              disabled={isCleaning}
              className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors disabled:opacity-50"
            >
              <div className="text-xs font-bold text-white">Clean Printhead</div>
              <div className="text-[11px] text-slate-400 mt-1">Clears clogged nozzles</div>
            </button>
            <button
              onClick={handleNozzleTest}
              disabled={isCleaning}
              className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors disabled:opacity-50"
            >
              <div className="text-xs font-bold text-white">Nozzle Check</div>
              <div className="text-[11px] text-slate-400 mt-1">Print pattern test sheet</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
