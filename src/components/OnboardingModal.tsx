import React, { useState } from 'react';
import { Cable, FileText, Printer, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: '1. Connect your printer',
      subtitle: 'Connect your Epson L120 using a USB OTG adapter directly to your phone. No Wi-Fi or PC needed.',
      icon: <Cable className="w-10 h-10 text-indigo-400" />,
      badge: 'Step 1 of 3'
    },
    {
      step: 2,
      title: '2. Choose what you want to print',
      subtitle: 'Select photos from your gallery, PDF contracts, Word/Excel documents, or scan receipts with the camera.',
      icon: <FileText className="w-10 h-10 text-indigo-400" />,
      badge: 'Step 2 of 3'
    },
    {
      step: 3,
      title: '3. Preview and print',
      subtitle: 'Check the live paper preview, adjust copies and quality, and tap Print for instant USB printing.',
      icon: <Printer className="w-10 h-10 text-emerald-400" />,
      badge: 'Step 3 of 3'
    }
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-center">
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Icon */}
        <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto shadow-inner">
          {currentStepData.icon}
        </div>

        {/* Step Info */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">
            {currentStepData.badge}
          </span>
          <h2 className="text-xl font-bold text-white pt-1">{currentStepData.title}</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            {currentStepData.subtitle}
          </p>
        </div>

        {/* Button */}
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>{step === 3 ? 'Get Started' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
