const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// Change centerpiece col-span from 6 to 9
code = code.replace(/\{\/\* CENTERPIECE: AERIAL CAMPUS INTERACTIVE TWIN \(Col 4-9\) \*\/\}\n\s*<div className="lg:col-span-6 space-y-4">/, '{/* CENTERPIECE: AERIAL CAMPUS INTERACTIVE TWIN (Col 4-12) */}\n        <div className="lg:col-span-9 space-y-4">');

// Remove RIGHT PANEL
code = code.replace(/\{\/\* ==========================================\n\s*RIGHT PANEL: REAL-TIME METRICS & CARBON \(Col 10-12\)\n\s*========================================== \*\/\}(.|\n)*?(?=\{\/\* ==========================================)/, '');

fs.writeFileSync('src/components/DashboardView.tsx', code);
