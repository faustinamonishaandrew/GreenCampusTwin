const fs = require('fs');
let code = fs.readFileSync('src/components/BuildingDetailsView.tsx', 'utf8');

const searchStr = /\{\/\* Equipment Predictive Health \*\/\}(.|\n)*?(?=<\/div>\n  \);\n\};\n)/g;

const replacement = `{/* Equipment Predictive Health Summary */}
      <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-500" />
              Equipment Predictive Health
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live telemetry monitoring for HVAC, Solar Inverters, and Smart Pumps.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('predictive_maintenance')}
            className="px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition flex items-center gap-2"
          >
            <span>Detailed Diagnostics</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(searchStr, replacement);
fs.writeFileSync('src/components/BuildingDetailsView.tsx', code);
