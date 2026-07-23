const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

// 1. Remove LARGE SUSTAINABILITY SCORE CARD
code = code.replace(/\{\/\* LARGE SUSTAINABILITY SCORE CARD \*\/\}(.|\n)*?(?=\{\/\* ==========================================)/g, '');

// 2. Remove CARBON FOOTPRINT CARD WITH WEEKLY BAR CHART
code = code.replace(/\{\/\* CARBON FOOTPRINT CARD WITH WEEKLY BAR CHART \*\/\}(.|\n)*?(?=\{\/\* ==========================================)/g, '');

// 3. Bottom Row changes: Remove SECTION 2 (Campus Blueprint) and SECTION 3 (Energy Breakdown)
// Make SECTION 1 (Quick Nav) span 4 cols, SECTION 4 (Greenie AI) span 8 cols
code = code.replace(/\{\/\* SECTION 1: QUICK NAVIGATION MENU \(Col 1-3\) \*\/\}/g, '{/* SECTION 1: QUICK NAVIGATION MENU (Col 1-4) */}');
code = code.replace(/<div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900\/90 border border-slate-200 dark:border-cyan-500\/30 p-4 shadow-xl backdrop-blur-md space-y-3">/g, function(match, offset, str) {
  // We need to change the first one (Quick Nav) to lg:col-span-4
  if (offset < str.indexOf('SECTION 2')) {
    return '<div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">';
  }
  return match;
});

// Remove section 2 and 3
code = code.replace(/\{\/\* SECTION 2: CAMPUS BLUEPRINT & SELECTED BUILDING \(Col 4-6\) \*\/\}(.|\n)*?(?=\{\/\* SECTION 4: GREENIE AI INSIGHTS & ALERTS \(Col 10-12\) \*\/\})/g, '');

// Change section 4 to lg:col-span-8
code = code.replace(/\{\/\* SECTION 4: GREENIE AI INSIGHTS & ALERTS \(Col 10-12\) \*\/\}\n\s*<div className="lg:col-span-3/, '{/* SECTION 4: GREENIE AI INSIGHTS & ALERTS (Col 5-12) */}\n        <div className="lg:col-span-8');

fs.writeFileSync('src/components/DashboardView.tsx', code);
