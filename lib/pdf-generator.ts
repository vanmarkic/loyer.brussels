import jsPDF from 'jspdf';
import type { CalculatorState, RentCalculationResult, RentComparison } from '@/types/calculator';
import { formatCurrency } from './utils';

export async function generateRentCalculationPDF(
  state: CalculatorState,
  calculation: RentCalculationResult,
  comparison?: RentComparison | null
): Promise<Blob> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, fontSize = 12, isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.text(text, x, y);
  };

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35);
  };

  const drawBox = (x: number, y: number, width: number, height: number, fillColor?: string) => {
    if (fillColor) {
      pdf.setFillColor(fillColor);
      pdf.rect(x, y, width, height, 'F');
    }
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(x, y, width, height);
  };

  // Page 1: Summary & Results
  // Header
  addText('LOYER.BRUSSELS', 20, yPosition, 20, true);
  yPosition += 10;
  addText('Brussels Reference Rent Calculation', 20, yPosition, 14, true);
  yPosition += 8;
  addText(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition, 10);
  yPosition += 15;

  // Property Summary
  addText('Property Summary', 20, yPosition, 16, true);
  yPosition += 10;

  if (state.address?.postalCode) {
    addText(`Address: ${state.address.streetName || ''} ${state.address.buildingNumber || ''} ${state.address.postalCode}`, 20, yPosition);
    yPosition += 7;
  }

  addText(`Type: ${state.propertyType?.replace('-', ' ') || 'N/A'}`, 20, yPosition);
  yPosition += 7;
  addText(`Living Space: ${state.propertyDetails?.livingSpace || 'N/A'} m²`, 20, yPosition);
  yPosition += 7;
  addText(`Bedrooms: ${state.propertyDetails?.bedrooms || 0}`, 20, yPosition);
  yPosition += 7;
  addText(`Bathrooms: ${state.propertyDetails?.bathrooms || 0}`, 20, yPosition);
  yPosition += 7;
  addText(`Energy Rating: ${state.energyRating || 'Unknown'}`, 20, yPosition);
  yPosition += 15;

  // Calculation Results Box
  addText('Calculation Results', 20, yPosition, 16, true);
  yPosition += 10;

  // Draw result boxes
  const boxWidth = (pageWidth - 60) / 3;
  const boxHeight = 30;
  const boxY = yPosition;

  // Minimum Rent
  drawBox(20, boxY, boxWidth, boxHeight, '#f3f4f6');
  addText('Minimum Fair Rent', 25, boxY + 10, 10);
  addText(formatCurrency(calculation.minimumRent), 25, boxY + 22, 14, true);

  // Median Rent
  drawBox(25 + boxWidth, boxY, boxWidth, boxHeight, '#dbeafe');
  addText('Median Fair Rent', 30 + boxWidth, boxY + 10, 10);
  addText(formatCurrency(calculation.medianRent), 30 + boxWidth, boxY + 22, 14, true);

  // Maximum Rent
  drawBox(30 + boxWidth * 2, boxY, boxWidth, boxHeight, '#f3f4f6');
  addText('Maximum Fair Rent', 35 + boxWidth * 2, boxY + 10, 10);
  addText(formatCurrency(calculation.maximumRent), 35 + boxWidth * 2, boxY + 22, 14, true);

  yPosition += boxHeight + 15;

  // Comparison (if provided)
  if (comparison) {
    addText('Your Rent Comparison', 20, yPosition, 16, true);
    yPosition += 10;

    addText(`Your Rent: ${formatCurrency(comparison.userRent)}`, 20, yPosition, 12, true);
    yPosition += 7;
    addText(`Difference: ${formatCurrency(Math.abs(comparison.difference))} (${comparison.percentageDifference.toFixed(1)}%)`, 20, yPosition);
    yPosition += 7;

    let statusText = '';
    let statusColor = '';
    switch (comparison.status) {
      case 'abusive':
        statusText = 'Your rent appears to exceed legal limits';
        statusColor = '#dc2626';
        break;
      case 'high':
        statusText = 'Your rent is at the upper end of the legal range';
        statusColor = '#ea580c';
        break;
      case 'fair':
        statusText = 'Your rent is within the legal reference range';
        statusColor = '#16a34a';
        break;
      case 'below':
        statusText = 'Your rent is below the reference grid';
        statusColor = '#2563eb';
        break;
    }

    pdf.setTextColor(statusColor);
    addText(`Status: ${statusText}`, 20, yPosition, 11, true);
    pdf.setTextColor('#000000');
    yPosition += 15;
  }

  // Page 2: Calculation Details
  pdf.addPage();
  yPosition = 20;

  addText('Calculation Details', 20, yPosition, 16, true);
  yPosition += 15;

  addText('Property Characteristics', 20, yPosition, 14, true);
  yPosition += 10;

  // Property details table
  const details = [
    ['Property Type', state.propertyType || 'N/A'],
    ['Living Space', `${state.propertyDetails?.livingSpace || 0} m²`],
    ['Bedrooms', `${state.propertyDetails?.bedrooms || 0}`],
    ['Bathrooms', `${state.propertyDetails?.bathrooms || 0}`],
    ['Energy Rating', state.energyRating || 'Unknown'],
    ['Postal Code', state.address?.postalCode || 'N/A'],
    ['Location Factor', calculation.difficultyIndex?.toFixed(2) || 'N/A'],
  ];

  details.forEach(([label, value]) => {
    addText(`${label}:`, 20, yPosition);
    addText(value, 100, yPosition, 12, true);
    yPosition += 7;
  });

  yPosition += 10;

  // Features
  if (state.features) {
    addText('Property Features', 20, yPosition, 14, true);
    yPosition += 10;

    const features = [
      ['Central Heating', state.features.centralHeating ? 'Yes' : 'No'],
      ['Thermal Regulation', state.features.thermalRegulation ? 'Yes' : 'No'],
      ['Double Glazing', state.features.doubleGlazing ? 'Yes' : 'No'],
      ['Second Bathroom', state.features.secondBathroom ? 'Yes' : 'No'],
      ['Recreational Spaces', state.features.recreationalSpaces ? 'Yes' : 'No'],
      ['Storage Spaces', state.features.storageSpaces ? 'Yes' : 'No'],
      ['Building Before 2000', state.features.buildingBefore2000 ? 'Yes' : 'No'],
      ['Garages', `${state.features.garages}`],
    ];

    features.forEach(([label, value]) => {
      addText(`${label}:`, 20, yPosition);
      addText(value, 100, yPosition);
      yPosition += 7;
    });
  }

  // Page 3: Legal Information
  pdf.addPage();
  yPosition = 20;

  addText('Legal Information', 20, yPosition, 16, true);
  yPosition += 15;

  addText('Brussels Rent Capping Regulations', 20, yPosition, 14, true);
  yPosition += 10;

  yPosition = addWrappedText(
    'The Brussels-Capital Region has implemented rent capping regulations to ensure fair rental prices. This calculation is based on the official Brussels Housing Code formula, which considers property characteristics, location, and amenities to determine a reference rent range.',
    20,
    yPosition,
    pageWidth - 40
  );
  yPosition += 10;

  addText('Important Disclaimers', 20, yPosition, 14, true);
  yPosition += 10;

  yPosition = addWrappedText(
    '• This calculation is for informational purposes only and does not constitute legal advice.\n• Only housing authorities or courts can make binding legal rulings about rent.\n• The reference rent is based on the information you provided. Accuracy depends on correct input.\n• Regulations are updated periodically. This calculation reflects current standards as of the generation date.',
    20,
    yPosition,
    pageWidth - 40
  );
  yPosition += 15;

  addText('Your Rights', 20, yPosition, 14, true);
  yPosition += 10;

  if (comparison?.status === 'abusive' || comparison?.status === 'high') {
    yPosition = addWrappedText(
      'If you believe your rent exceeds legal limits, you have the right to:\n• Request rent negotiation with your landlord\n• Contact Brussels Housing Inspection for guidance\n• Seek support from tenant rights organizations\n• File a complaint with housing authorities',
      20,
      yPosition,
      pageWidth - 40
    );
  } else {
    yPosition = addWrappedText(
      'All tenants in Brussels have rights regarding:\n• Fair rent based on property characteristics\n• Annual rent indexation limits\n• Property maintenance and repairs\n• Protection against unjust eviction',
      20,
      yPosition,
      pageWidth - 40
    );
  }
  yPosition += 15;

  addText('Resources', 20, yPosition, 14, true);
  yPosition += 10;

  yPosition = addWrappedText(
    'WUUNE (Brussels Tenants Collective)\nEmail: contact@wuune.be\nWebsite: loyer.brussels\n\nBrussels Housing Inspection\nFor official rent disputes and housing quality issues\n\nFree Legal Aid\nAvailable for tenants who qualify based on income',
    20,
    yPosition,
    pageWidth - 40
  );

  // Footer on all pages
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor('#666666');
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
    pdf.text('Generated by Loyer.Brussels', 20, pageHeight - 10);
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
