import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Smartphone, 
  Cable, 
  Printer as PrinterIcon, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Wifi, 
  Network, 
  HelpCircle, 
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { ConnectionType, Printer } from '../types';
import { UsbPrinterService, EPSON_L120_DEFAULT } from '../services/usbPrinterService';

interface PrinterSetupWizardProps {
  onBack: () => void;
  onPrinterSelected: (printer: Printer) => void;
  currentPrinter: Printer;
}

export const PrinterSetupWizard: React.FC<PrinterSetupWizardProps> = ({
  onBack,
  onPrinterSelected,
  currentPrinter
}) => {
  const [activeTab, setActiveTab] = useState<ConnectionType>('usb');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedPrinter, setDetectedPrinter] = useState<Printer | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  const [troubleshootChecklist, setTroubleshootChecklist] = useState({
    powerOn: true,
    cableConnected: true,
    otgConnected: true,
    permissionAllowed: true
  });

  const handleStartDetect = async () => {
    setIsDetecting(true);
    setShowTroubleshoot(false);

    try {
      const res = await UsbPrinterService.detectUsbPrinter();
      setIsDetecting(false);
      if (res.success && res.printer) {
        // Show USB permission step
        setShowPermissionModal(true);
        setDetectedPrinter(res.printer);
      } else {
        setShowTroubleshoot(true);
      }
    } catch (e) {
      setIsDetecting(false);
      setShowTroubleshoot(true);
    }
  };

  const handleAllowPermission = () => {
    setShowPermissionModal(false);
    if (detectedPrinter) {
      onPrinterSelected(detectedPrinter);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top App Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white">Connect Your Printer</h1>
        </div>
        <button
          onClick={() => setShowTroubleshoot(!showTroubleshoot)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Help</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-lg mx-auto w-full space-y-6 pb-20">
        {/* Connection Type Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('usb')}
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'usb'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cable className="w-4 h-4" />
            <span>USB Printer</span>
          </button>
          <button
            onClick={() => setActiveTab('wifi')}
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'wifi'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>Wi-Fi Printer</span>
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'network'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Network</span>
          </button>
        </div>

        {activeTab === 'usb' && (
          <div className="space-y-6">
            {/* USB Intro Banner */}
            <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 text-center">
              <p className="text-sm font-medium text-indigo-200">
                Connect your printer to your phone using a <span className="font-bold text-white">USB OTG adapter</span>.
              </p>
              <p className="text-xs text-indigo-300/80 mt-1">
                Epson L120 is an ink tank USB printer without built-in Wi-Fi. Direct USB OTG provides ultra-fast, zero-lag printing.
              </p>
            </div>

            {/* Illustrated Connection Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                Connection Diagram
              </div>

              <div className="flex flex-col items-center space-y-2">
                {/* Step 1: Phone */}
                <div className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Android Phone / Tablet</div>
                    <div className="text-xs text-slate-400">USB Host / OTG Supported</div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="w-0.5 h-4 bg-indigo-500/40" />
                </div>

                {/* Step 2: OTG Adapter */}
                <div className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Cable className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">USB OTG Adapter</div>
                    <div className="text-xs text-slate-400">Type-C or Micro-USB to USB-A (Female)</div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="w-0.5 h-4 bg-indigo-500/40" />
                </div>

                {/* Step 3: USB Printer Cable */}
                <div className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Cable className="w-5 h-5 rotate-90" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">USB Printer Cable</div>
                    <div className="text-xs text-slate-400">Standard USB-A to Type-B Cable</div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-1">
                  <div className="w-0.5 h-4 bg-indigo-500/40" />
                </div>

                {/* Step 4: Epson L120 */}
                <div className="w-full bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <PrinterIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <span>Epson L120</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">Target Printer</span>
                    </div>
                    <div className="text-xs text-emerald-400/80">Power Turned ON • Paper Loaded</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detect Action Button */}
            {!detectedPrinter ? (
              <button
                onClick={handleStartDetect}
                disabled={isDetecting}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-75"
              >
                {isDetecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Detecting Epson L120...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Detect Printer</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Printer Found!</h3>
                  <p className="text-emerald-300 font-semibold text-base">{detectedPrinter.name}</p>
                  <p className="text-xs text-slate-400 mt-1">Vendor ID: 0x04B8 (Seiko Epson) • USB OTG</p>
                </div>
                <button
                  onClick={() => onPrinterSelected(detectedPrinter)}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.99]"
                >
                  Use This Printer
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'usb' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center">
              {activeTab === 'wifi' ? <Wifi className="w-7 h-7" /> : <Network className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {activeTab === 'wifi' ? 'Wi-Fi Printer Discovery' : 'Network Print Server'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                The <span className="text-white font-medium">Epson L120</span> is a dedicated USB-only printer without internal Wi-Fi. 
                If you share it via a wireless print server, Raspberry Pi CUPS, or router USB port, it can be discovered here.
              </p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 text-left">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>For direct phone printing without a computer, use the <strong>USB OTG</strong> tab.</span>
            </div>
          </div>
        )}

        {/* Troubleshooting Section (When requested or detected) */}
        {showTroubleshoot && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Let's connect your printer</span>
            </div>
            <p className="text-xs text-slate-300">
              Please verify the following checklist to ensure Android communicates with the Epson L120:
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <label className="flex items-center gap-2.5 p-2 bg-slate-950 rounded-lg cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={troubleshootChecklist.powerOn}
                  onChange={(e) => setTroubleshootChecklist({ ...troubleshootChecklist, powerOn: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>✓ Epson L120 power switch is turned <strong>ON</strong> (green LED solid)</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950 rounded-lg cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={troubleshootChecklist.cableConnected}
                  onChange={(e) => setTroubleshootChecklist({ ...troubleshootChecklist, cableConnected: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>✓ USB printer cable firmly connected to printer square Type-B port</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950 rounded-lg cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={troubleshootChecklist.otgConnected}
                  onChange={(e) => setTroubleshootChecklist({ ...troubleshootChecklist, otgConnected: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>✓ OTG adapter firmly plugged into Android phone charging port</span>
              </label>
              <label className="flex items-center gap-2.5 p-2 bg-slate-950 rounded-lg cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={troubleshootChecklist.permissionAllowed}
                  onChange={(e) => setTroubleshootChecklist({ ...troubleshootChecklist, permissionAllowed: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>✓ USB permission granted in Android prompt</span>
              </label>
            </div>

            <button
              onClick={handleStartDetect}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Detect Again</span>
            </button>
          </div>
        )}
      </div>

      {/* USB Permission Modal (Simulation of Android OS USB Request) */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
              <PrinterIcon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">USB Permission</h3>
              <p className="text-sm text-slate-300 mt-2">
                Allow <strong>EasyPrint</strong> to access <strong>Epson L120</strong>?
              </p>
              <p className="text-xs text-slate-400 mt-1">
                EasyPrint will remember this USB device for one-tap printing.
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAllowPermission}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-colors"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
