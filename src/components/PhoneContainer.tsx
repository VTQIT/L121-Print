import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  isFrameMode: boolean;
  onToggleFrame: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({
  children,
  isFrameMode,
  onToggleFrame
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isFrameMode) {
    return (
      <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center p-2 sm:p-6 select-none">
      {/* Android Device Mockup Frame */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-slate-900 rounded-[44px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_10px_#1e293b,0_0_0_12px_#334155] border border-slate-700 flex flex-col overflow-hidden">
        {/* Android Status Bar */}
        <div className="h-7 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 bg-slate-950 shrink-0 z-30 select-none">
          <span className="font-mono">{currentTime}</span>

          {/* Camera Punch Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
          </div>

          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative rounded-b-[34px]">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="h-5 bg-slate-950 flex items-center justify-center shrink-0 z-30">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
