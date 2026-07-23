const fs = require('fs');
let code = fs.readFileSync('src/components/BuildingDetailsView.tsx', 'utf8');

const searchStr = /\{\/\* Right: Anomalies \*\/\}(.|\n)*?(?=\{\/\* Equipment Predictive Health \*\/\})/g;

const replacement = `{/* Right: Anomalies Summary */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Anomalies
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              {buildingAnomalies.length} active anomaly/anomalies detected for this facility.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('anomalies')}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <span>View Full Anomalies Report</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Equipment Predictive Health */}
`;

code = code.replace(searchStr, replacement);
fs.writeFileSync('src/components/BuildingDetailsView.tsx', code);
