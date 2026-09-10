import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';

export const EthicalNoticeBanner: React.FC = () => {
  return (
    <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-900 leading-relaxed shadow-xs">
      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <p className="font-semibold text-blue-950">
          Educational Role Recommendations &amp; Transparency Notice
        </p>
        <p className="text-blue-800 text-[11px] sm:text-xs">
          Opportunities shown below are simulated benchmark profiles designed to evaluate your
          skill alignment against real-world job criteria. Recommendations are diagnostic suggestions
          and do not constitute automated hiring decisions, recruitment screening, or corporate
          endorsements.
        </p>
      </div>
    </div>
  );
};
