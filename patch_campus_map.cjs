const fs = require('fs');
let code = fs.readFileSync('src/components/CampusMapView.tsx', 'utf8');

// Replace everything from {/* Live Telemetry Grid */} to {/* Modal Action Buttons */} 
// with a simple summary widget
const replacement = `
            {/* Modal Action Buttons */}`;

code = code.replace(/\{\/\* Live Telemetry Grid \*\/\}(.|\n)*?\{\/\* Modal Action Buttons \*\/\}/g, replacement);

fs.writeFileSync('src/components/CampusMapView.tsx', code);
