const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');

let stream;

const generateInvoice = () => {
  const doc = new PDFDocument();

  // Pipe the PDF output to a file
  stream = fs.createWriteStream('invoice.pdf');
  doc.pipe(stream);

  // Logo
  doc.image('damensch.png', 50, 50, { width: 100 });

  // QR Code
  QRCode.toDataURL('Your QR Code Data', (err, url) => {
    if (err) throw err;
    doc.image(url, 450, 50, { width: 100 });
    // generateContent(doc);
    // Finalize and save the PDF
    
    doc.end();
    // console.log(stream);
    // stream.close();
  });

  

  stream.on('finish', (response) => {
    console.log('Invoice created successfully with response', response);
  });
  
};

const generateContent = (doc) => {
  // Addresses
  const addresses = {
    from: { name: 'Your Name', street: '123 Main St', city: 'City', state: 'State', zip: '12345' },
    billing: { name: 'Billing Name', street: '456 Billing St', city: 'Billing City', state: 'Billing State', zip: '54321' },
    shipping: { name: 'Shipping Name', street: '789 Shipping St', city: 'Shipping City', state: 'Shipping State', zip: '67890' },
  };

  doc.font('Helvetica-Bold').fontSize(14).text('From Address', 50, 200);
  drawAddress(doc, addresses.from, 50, 230);

  doc.font('Helvetica-Bold').fontSize(14).text('Billing Address', 200, 200);
  drawAddress(doc, addresses.billing, 200, 230);

  doc.font('Helvetica-Bold').fontSize(14).text('Shipping Address', 350, 200);
  drawAddress(doc, addresses.shipping, 350, 230);

  // Line Items
  const lineItems = [
    { description: 'Item 1', quantity: 2, price: 10 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 },
    { description: 'Item 2', quantity: 1, price: 20 }
    // ... Add more line items as needed
  ];

  drawTable(doc, lineItems, 50, 400);

  // Finalize and save the PDF
  stream.on('finish', () => {
    console.log('Invoice created successfully.');
  });
};

const drawAddress = (doc, address, x, y) => {
  doc.font('Helvetica').fontSize(12).text(address.name, x, y);
  doc.text(address.street, x, y + 20);
  doc.text(`${address.city}, ${address.state} ${address.zip}`, x, y + 40);
};

const drawTable = (doc, lineItems, x, y) => {
  const headers = ['Description', 'Quantity', 'Price', 'Total'];
  const tableTop = y;
  const tableLeft = x;
  const rowHeight = 20;
  const colWidths = [200, 50, 100, 100];
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Draw header
  drawTableRow(doc, headers, tableLeft, tableTop, colWidths, true);

  // Draw rows
  let currentY = tableTop + rowHeight;
  let remainingHeight = 750 - currentY; // Adjust the total height as needed

  lineItems.forEach((item) => {
    const totalHeightRequired = rowHeight * 2; // Considering each row requires 2 lines
    if (remainingHeight < totalHeightRequired) {
      doc.addPage(); // Move to the next page if the current one doesn't have enough space
      currentY = 50;
      drawTableRow(doc, headers, tableLeft, currentY, colWidths, true);
      currentY += rowHeight;
      remainingHeight = 750 - currentY; // Update remaining height for the new page
    }

    drawTableRow(doc, [item.description, item.quantity, `$${item.price.toFixed(2)}`, `$${(item.quantity * item.price).toFixed(2)}`], tableLeft, currentY, colWidths);
    currentY += rowHeight;
    remainingHeight -= totalHeightRequired;
  });

  // Draw borders for the table
  doc.rect(tableLeft, tableTop, tableWidth, currentY - tableTop).stroke();
};

const drawTableRow = (doc, rowData, x, y, colWidths, isHeader = false) => {
  rowData.forEach((item, i) => {
    doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(12).text(item, x + sumArray(colWidths, i), y);
  });
};

const sumArray = (arr, endIndex) => {
  return arr.slice(0, endIndex + 1).reduce((acc, val) => acc + val, 0);
};

generateInvoice();
