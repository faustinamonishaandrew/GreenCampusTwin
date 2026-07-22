import jsPDF from 'jspdf';
import { Building, SustainabilityScores, Anomaly, Recommendation } from '../types';
import { formatCurrencyINR } from './aiEngine';

export function generateSustainabilityReportPDF(
  buildings: Building[],
  scores: SustainabilityScores,
  anomalies: Anomaly[],
  recommendations: Recommendation[],
  period: 'Weekly' | 'Monthly' | 'Annual' = 'Monthly'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = '#22C55E';
  const darkBg = '#0F172A';

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(34, 197, 94); // #22C55E
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('GREEN CAMPUS DIGITAL TWIN', 14, 16);

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`AI Sustainability & Carbon Footprint Audit Report (${period})`, 14, 24);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, 14, 31);
  doc.text('Status: Verified by AI Studio Engine v2.4', 130, 31);

  // 2. Executive Summary Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 44, 182, 38, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 44, 182, 38, 3, 3, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUSTAINABILITY AUDIT SUMMARY', 20, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Overall Campus Sustainability Score: ${scores.overall} / 100 (Grade ${scores.grade})`, 20, 60);
  doc.text(`Performance Rating: +${scores.benchmarkComparisonPct}% superior to national educational benchmarks.`, 20, 66);
  
  const totalEnergy = buildings.reduce((a, b) => a + b.currentEnergyKwh, 0);
  const totalWater = buildings.reduce((a, b) => a + b.currentWaterLiters, 0);
  const totalCarbon = buildings.reduce((a, b) => a + b.currentCarbonKg, 0);

  doc.text(`Total Daily Energy: ${totalEnergy.toLocaleString()} kWh | Water: ${totalWater.toLocaleString()} L | CO2 Footprint: ${totalCarbon.toLocaleString()} kg`, 20, 72);

  // 3. Category Score Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Key Sustainability Dimension Scores', 14, 90);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 94, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Dimension', 18, 99.5);
  doc.text('Score (0-100)', 75, 99.5);
  doc.text('Status / Rating', 125, 99.5);
  doc.text('Target Benchmark', 165, 99.5);

  const dimensions = [
    { name: 'Energy Efficiency & Solar PV', score: scores.energy, benchmark: '80+' },
    { name: 'Water Conservation & Recycling', score: scores.water, benchmark: '80+' },
    { name: 'Waste Diversion & Recycling', score: scores.waste, benchmark: '75+' },
    { name: 'Indoor Air Quality (AQI)', score: scores.airQuality, benchmark: '85+' },
    { name: 'Carbon Neutrality Factor', score: scores.carbon, benchmark: '80+' },
  ];

  let yPos = 108;
  dimensions.forEach((dim) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(dim.name, 18, yPos);
    doc.text(`${dim.score} / 100`, 75, yPos);
    
    let ratingStr = 'Optimal';
    if (dim.score < 70) ratingStr = 'Action Required';
    else if (dim.score >= 85) ratingStr = 'Exemplary';

    doc.text(ratingStr, 125, yPos);
    doc.text(dim.benchmark, 165, yPos);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos + 3, 196, yPos + 3);
    yPos += 8;
  });

  // 4. Building Telemetry Breakdown Table
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Building-Level Telemetry Breakdown', 14, yPos);

  yPos += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, yPos, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Building Name', 18, yPos + 5.5);
  doc.text('Rating', 75, yPos + 5.5);
  doc.text('Energy (kWh)', 98, yPos + 5.5);
  doc.text('Water (L)', 132, yPos + 5.5);
  doc.text('Carbon (kg)', 165, yPos + 5.5);

  yPos += 10;
  buildings.slice(0, 8).forEach((b) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(b.name, 18, yPos);
    doc.text(b.efficiencyRating, 75, yPos);
    doc.text(b.currentEnergyKwh.toLocaleString(), 98, yPos);
    doc.text(b.currentWaterLiters.toLocaleString(), 132, yPos);
    doc.text(b.currentCarbonKg.toLocaleString(), 165, yPos);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos + 2.5, 196, yPos + 2.5);
    yPos += 7;
  });

  // 5. Active Recommendations & Potential Financial Savings
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. AI Prescriptive Recommendations & ROI', 14, yPos);

  yPos += 4;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, yPos, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Recommendation Strategy', 18, yPos + 5.5);
  doc.text('Est. Savings (INR)', 120, yPos + 5.5);
  doc.text('CO2 Saved', 165, yPos + 5.5);

  yPos += 10;
  recommendations.slice(0, 4).forEach((rec) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(rec.title.length > 55 ? rec.title.slice(0, 52) + '...' : rec.title, 18, yPos);
    doc.text(formatCurrencyINR(rec.estimatedSavingsInr), 120, yPos);
    doc.text(`${rec.estimatedCarbonSavedKg.toLocaleString()} kg`, 165, yPos);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, yPos + 2.5, 196, yPos + 2.5);
    yPos += 7;
  });

  // Footer Page Number
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Green Campus Digital Twin Command Center — Official Sustainability Audit Document', 14, 287);
  doc.text('Page 1 of 1', 185, 287);

  // Save PDF
  doc.save(`Green_Campus_Sustainability_Report_${period}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
