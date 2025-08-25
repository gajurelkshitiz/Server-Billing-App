const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Draws the header section
function drawHeader(doc, invoiceData, currentY) {
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('TAX INVOICE', { align: 'center', underline: true });
  
  // Only show "Copy of Original" on the right side if printFlag is true
  if (invoiceData.printFlag) {
    doc
      .text('Copy of Original', { align: 'right' });
  }  
  currentY = doc.y;
  return currentY;
}

// Draws the company info section
function drawCompanyInfo(doc, invoiceData, currentY) {
  // Add vertical gap before company info
  currentY += 20; // Adjust this value for more/less gap
  doc.y = currentY;
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text(invoiceData.company.name, { align: 'center' });
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(invoiceData.company.address, { align: 'center' })
    .font('Helvetica-Bold')
    .text(`VAT:${invoiceData.company.vat}`, { align: 'center' })
    .font('Helvetica'); // revert to normal if more text follows

  currentY = doc.y + 10;
  doc
    .moveTo(10, currentY)
    .lineTo(585, currentY)
    .stroke();
  
  return currentY;
}

function generateSalesInvoice(invoiceData, res) {

  console.log('Started making sales invoice');

  const doc = new PDFDocument({ margin: 20, size: 'A4' });

  // Handle PDFKit errors
  doc.on('error', (err) => {
    console.error('PDFKit error:', err);
    // Optionally, you can destroy the response if not already finished
    if (!res.headersSent) {
      res.status(500).end('PDF generation error');
    }
  });

  doc.pipe(res);

  // Draw border
  doc.rect(10, 10, 575, 820).stroke();

  // Start at top margin
  let currentY = 20;

  // Header
  currentY = drawHeader(doc, invoiceData, currentY);

  // Company Info
  currentY = drawCompanyInfo(doc, invoiceData, currentY);



  // Invoice Details

  // drawing vertical Partition
  doc
    .moveTo(285, currentY)
    .lineTo(285, currentY + 40)
    .stroke();


  currentY += 10;
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`Invoice No.: ${invoiceData.invoiceNumber}`, 30, currentY)
    .text(`Date of Invoice: ${invoiceData.date}`, 30, currentY + 15)
    .text(`Place of Supply: ${invoiceData.placeOfSupply}`, 300, currentY)
    .text(`Reverse Charge: ${invoiceData.reverseCharge}`, 300, currentY + 15);

  currentY += 30;
  doc
    .moveTo(10, currentY)
    .lineTo(585, currentY)
    .stroke();

  // For Vertical Partition
  doc
    .moveTo(285, currentY)  
    .lineTo(285, currentY + 70)
    .stroke();


  currentY += 10   
  // Billed to / Shipped to
  doc
    .font('Helvetica-Bold')
    .text('Billed to:', 30, currentY)
    .text('Shipped to:', 300, currentY);

  currentY += 15;

  doc
    .font('Helvetica')
    .text(invoiceData.billedTo.name, 30, currentY)
    .text(`Address: ${invoiceData.billedTo.address}`, 30, currentY + 15)
    .text(`PAN No.: ${invoiceData.billedTo.pan}`, 30, currentY + 30)
    .text(invoiceData.shippedTo.name, 300, currentY)
    .text(`Address: ${invoiceData.shippedTo.address}`, 300, currentY + 15);

  currentY += 45;
  doc
    .moveTo(10, currentY)
    .lineTo(585, currentY)
    .stroke();


  // Table Header
  // Increased table width: left margin 20, right margin 575, width 555 (was 535)
  // Adjusted column positions for wider table
  // New colX: [20, 55, 95, 265, 320, 385, 440, 495, 575]
  const colX = [20, 55, 115, 265, 320, 385, 440, 495, 575];
  let tableTop = currentY + 30;
  doc
    .rect(20, tableTop, 555, 20).stroke()
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('S.N', colX[0] + 5, tableTop + 5, { width: colX[1] - colX[0] - 10, align: 'center' })
    .text('Item Code', colX[1] + 5, tableTop + 5, { width: colX[2] - colX[1] - 10, align: 'center' })
    .text('Description of Goods', colX[2] + 5, tableTop + 5, { width: colX[3] - colX[2] - 10, align: 'center' })
    .text('HS Code', colX[3] + 5, tableTop + 5, { width: colX[4] - colX[3] - 10, align: 'center' })
    .text('Qty', colX[4] + 5, tableTop + 5, { width: colX[5] - colX[4] - 10, align: 'center' })
    .text('Unit', colX[5] + 5, tableTop + 5, { width: colX[6] - colX[5] - 10, align: 'center' })
    .text('Price', colX[6] + 5, tableTop + 5, { width: colX[7] - colX[6] - 10, align: 'center' })
    .text('Amount', colX[7] + 5, tableTop + 5, { width: colX[8] - colX[7] - 10, align: 'center' });

  // Draw vertical lines for table header columns
  for (let i = 1; i < colX.length; i++) {
    doc.moveTo(colX[i], tableTop).lineTo(colX[i], tableTop + 20).stroke();
  }

  // Table Rows
  let y = tableTop + 20;
  doc.font('Helvetica').fontSize(10);

  // 1. Draw actual item rows
  invoiceData.items.forEach((item, i) => {
    doc
      .rect(20, y, 555, 20).stroke()
      .text(i + 1, colX[0] + 5, y + 5, { width: colX[1] - colX[0] - 10, align: 'center' })
      .text(item.itemCode, colX[1] + 5, y + 5, { width: colX[2] - colX[1] - 10, align: 'center' })
      .text(item.description, colX[2] + 5, y + 5, { width: colX[3] - colX[2] - 10 })
      .text(item.hsCode, colX[3] + 5, y + 5, { width: colX[4] - colX[3] - 10, align: 'center' })
      .text(item.qty, colX[4] + 5, y + 5, { width: colX[5] - colX[4] - 10, align: 'center' })
      .text(item.unit, colX[5] + 5, y + 5, { width: colX[6] - colX[5] - 10, align: 'center' })
      .text(item.price.toLocaleString(), colX[6] + 5, y + 5, { width: colX[7] - colX[6] - 10, align: 'right' })
      .text(item.amount.toLocaleString(), colX[7] + 5, y + 5, { width: colX[8] - colX[7] - 10, align: 'right' });
    // Draw vertical lines for each row
    for (let j = 1; j < colX.length; j++) {
      doc.moveTo(colX[j], y).lineTo(colX[j], y + 20).stroke();
    }
    y += 20;
  });

  // Table Footer (empty rows if needed)
  // for (let i = invoiceData.items.length; i < 5; i++) {
  //   doc.rect(20, y, 555, 20).stroke();
  //   for (let j = 1; j < colX.length; j++) {
  //     doc.moveTo(colX[j], y).lineTo(colX[j], y + 20).stroke();
  //   }
  //   y += 20;
  // }

  // for (let i = 0; i < 2; i++) {
  //   doc.rect(20, y, 555, 20).stroke();
  //   for (let j = 1; j < colX.length; j++) {
  //     doc.moveTo(colX[j], y).lineTo(colX[j], y + 20).stroke();
  //   }
  //   y += 20;
  // }

  // Subtotal, VAT, Grand Total
  y += 5;
  doc
    .font('Helvetica')
    .text('', 390, y)
    .text(invoiceData.subtotal.toLocaleString(), 380, y, { width: 190, align: 'right' });
  y += 20;
  doc
    .font('Helvetica-Bold')
    .text(`Add: VAT @${invoiceData.vat}%`, 390, y)
    .text(invoiceData.vatAmount.toLocaleString(), 380, y, { width: 190, align: 'right' });
  y += 20;
  doc
    .font('Helvetica-Bold')
    .text('Grand Total', 390, y)
    .text(invoiceData.total.toLocaleString(), 380, y, { width: 190, align: 'right' });

  // // VAT Table
  // y += 40;
  // doc
  //   .font('Helvetica-Bold')
  //   .text('Code', 35, y)
  //   .text('Tax Rate', 75, y)
  //   .text('Taxable Amount', 135, y)
  //   .text('VAT', 225, y)
  //   .text('Total Tax', 275, y);

  // y += 15;

  // doc
  //   .moveTo(30, y)
  //   .lineTo(310, y)
  //   .stroke();

  // // Add a small vertical gap after the line
  // y += 5;

  // doc.font('Helvetica');
  // invoiceData.vatTable.forEach(row => {
  //   doc
  //     .text(row.code, 35, y)
  //     .text(row.taxRate, 75, y)
  //     .text(row.taxableAmount.toLocaleString(), 135, y)
  //     .text(row.vat.toLocaleString(), 225, y)
  //     .text(row.totalTax.toLocaleString(), 275, y);
  //   y += 15;
  // });

  // doc
  //   .moveTo(30, y)
  //   .lineTo(310, y)
  //   .stroke();
  
  // y += 5;
  // doc
  //   .font('Helvetica-Bold')
  //   .text('Total', 35, y)
  //   .text(invoiceData.total_tax_amount.toLocaleString(), 275, y)
  // y += 15;  
  
  // doc
  //   .moveTo(30, y)
  //   .lineTo(310, y)
  //   .stroke();

  


  // Amounts in words:
  y += 40;
  doc
    .text("Amount in words: ", 35, y);

  // Write the amountInWords text above the dash, aligned with the dash
  doc
    .font('Helvetica-Oblique')
    .fontSize(11)
    .text(invoiceData.amountInWords, 130, y);

  // Draw the dashed line below the amountInWords text
  doc
    .dash(2, { space: 5 }) // Enable dashed line
    .moveTo(130, y + 15)
    .lineTo(500, y + 15)
    .stroke()
    .undash(); // Disable dashed line for subsequent lines





  // Terms & Conditions and Signature
  y += 30;
  const sectionHeight = 100;
  doc
    .rect(30, y, 270, sectionHeight).stroke()
    .rect(305, y, 260, sectionHeight).stroke()
    .font('Helvetica-Bold')
    .text('Terms & Conditions', 35, y + 5, { underline: true })
    .text("Receiver's Signature", 310, y + 5)
    .font('Helvetica')
    .fontSize(12)
    .text('E.&O.E\n*     Goods once sold cannot be returned', 35, y + 20)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('For Beauty Care Enterprises\n\n\nAuthorised Signatory', 425, y + 55);
  // Add horizontal partition inside the right section
  doc
    .moveTo(305, y + sectionHeight / 2)
    .lineTo(565, y + sectionHeight / 2)
    .stroke();

  

  // footer at the bottom of the page
  const pageHeight = doc.page.height;
  const footerY = pageHeight - 60; // 60 units from the bottom

  doc
    .font('Helvetica-Oblique')
    .fontSize(10)
    .text('Generated on: ', 35, footerY)
    .text(invoiceData.generated_datetime, 120, footerY)
    // .text('(NPT)', 220, footerY)
    .fillColor('#888888')
    .text('This is a computer-generated invoice. No signature or seal is required.', 35, footerY + 15)
    .fillColor('black') // Reset color for any further text
    .fontSize(12);      // Reset font size for any further text

  console.log('Ended making sales invoice');
  doc.end();
}

module.exports = { generateSalesInvoice, drawHeader, drawCompanyInfo };