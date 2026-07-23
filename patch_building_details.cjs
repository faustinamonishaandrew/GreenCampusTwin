const fs = require('fs');
let code = fs.readFileSync('src/components/BuildingDetailsView.tsx', 'utf8');

// Replace the Left: AI Prescriptions block inside BuildingDetailsView
const searchStr = /\{\/\* Left: AI Prescriptions \*\/\}(.|\n)*?(?=\{\/\* Right: Anomalies \*\/\})/g;

const replacement = `{/* Left: AI Prescriptions Summary */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Building Specific AI Prescriptions
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              {buildingRecs.length} active recommendation(s) for this facility.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('recommendations')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <span>View Full Recommendations</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        `;

code = code.replace(searchStr, replacement);
fs.writeFileSync('src/components/BuildingDetailsView.tsx', code);
