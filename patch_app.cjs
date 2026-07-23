const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<BuildingDetailsView\s+building=\{selectedBuildingObj\}\s+telemetryHistory=\{telemetryHistory\}\s+recommendations=\{SAMPLE_RECOMMENDATIONS\}\s+anomalies=\{SAMPLE_ANOMALIES\}\s+onBack=\{\(\) => setSelectedBuildingId\(null\)\}\s+onApplyRecommendation=\{handleApplyRecommendation\}\s+\/>/g, `<BuildingDetailsView
                building={selectedBuildingObj}
                telemetryHistory={telemetryHistory}
                recommendations={SAMPLE_RECOMMENDATIONS}
                anomalies={SAMPLE_ANOMALIES}
                onBack={() => setSelectedBuildingId(null)}
                onApplyRecommendation={handleApplyRecommendation}
                onNavigateToTab={setActiveTab}
              />`);

fs.writeFileSync('src/App.tsx', code);
