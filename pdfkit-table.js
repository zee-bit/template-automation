// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const generateTablePDF = () => {
//   const doc = new PDFDocument();

//   // Pipe the PDF output to a file
//   const stream = fs.createWriteStream('table_example.pdf');
//   doc.pipe(stream);

//   // Table Data
//   const header = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
//   const rows = [
//     ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3', 'Row 1, Cell 4'],
//     ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3', 'Row 2, Cell 4'],
//     ['Row 3, Cell 1', 'Row 3, Cell 2', 'Row 3, Cell 3', 'Row 3, Cell 4'],
//     // Add more rows as needed
//   ];

//   // Set font size
//   doc.fontSize(12);

//   // Draw header
//   drawTableRow(doc, header, { header: true });

//   // Draw rows
//   rows.forEach(row => drawTableRow(doc, row));

//   // Finalize and save the PDF
//   stream.on('finish', () => {
//     console.log('Table PDF created successfully.');
//   });

//   doc.end();
// };

// // Function to draw a table row
// const drawTableRow = (doc, row, options = {}) => {
//   const cellPadding = 5;
//   const startY = doc.y;

//   row.forEach((cell, i) => {
//     const cellWidth = doc.widthOfString(cell) + cellPadding * 2;
//     const cellHeight = doc.currentLineHeight() + cellPadding * 2;

//     const x = doc.x + cellPadding;
//     const y = doc.y + cellPadding;

//     if (options.header) {
//       doc.rect(x, y, cellWidth, cellHeight).fillAndStroke('#eee', '#000');
//       doc.fillColor('#000').text(cell, x, y);
//     } else {
//       doc.rect(x, y, cellWidth, cellHeight).fillAndStroke('#fff', '#000');
//       doc.fillColor('#000').text(cell, x, y);
//     }

//     doc.x += cellWidth;
//   });

//   doc.x = 50; // Reset X to left margin
//   doc.y += options.header ? 2 * cellPadding : cellPadding;

//   if (options.header) {
//     doc.moveDown(); // Add space after header
//   }
// };

// generateTablePDF();
//----------------------------------------------------------------------------
// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const doc = new PDFDocument();

// // Add tags for the document and table
// doc.addTag('Document').addTag('Table');

// // Function to add a table row with tags
// function addTableRow(rowData) {
//   // Each row is a Table element
//   doc.addTag('TBody').addTag('Row');

//   // Add cells for each column
//   rowData.forEach((cellData, index) => {
//     // Each cell is a TH or TD element based on the row index
//     const cellTag = doc.x === 72 ? 'TH' : 'TD';
//     doc.addTag(cellTag).text(cellData);
//   });

//   // End the current Row
//   doc.addTag('Row');
// }

// // Function to add table headers
// function addTableHeaders() {
//   // Headers are added as TH cells
//   const headers = ['Header 1', 'Header 2', 'Header 3', 'Header 4'];
//   doc.addTag('THead').addTag('Row');
//   headers.forEach(header => doc.addTag('TH').text(header));
//   doc.addTag('Row');
// }

// // Add table headers
// addTableHeaders();

// // Add table rows
// const rows = [
//   ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3', 'Row 1, Cell 4'],
//   ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3', 'Row 2, Cell 4'],
//   ['Row 3, Cell 1', 'Row 3, Cell 2', 'Row 3, Cell 3', 'Row 3, Cell 4'],
// ];

// rows.forEach(row => addTableRow(row));

// // Create a PDF file
// const stream = fs.createWriteStream('tagged_table_example.pdf');
// doc.pipe(stream);
// doc.end();
//----------------------------------------------------------------------------
/**
 * You need to install on terminal (node.js):
 * -----------------------------------------------------
 * $ npm install pdfkit-table
 * -----------------------------------------------------
 * Run this file:
 * -----------------------------------------------------
 * $ node index-example.js
 * -----------------------------------------------------
 * 
 */

const fs = require("fs");
const PDFDocument = require("pdfkit-table");

// start pdf document
let doc = new PDFDocument({ margin: 30, size: 'A4' });
// to save on server
doc.pipe(fs.createWriteStream("./document.pdf"));

// -----------------------------------------------------------------------------------------------------
// Simple Table with Array
// -----------------------------------------------------------------------------------------------------
const tableArray = {
  headers: ["Country", "Conversion rate", "Trend"],
  rows: [
    ["Switzerland", "12%", "+1.12%"],
    ["France", "67%", "-0.98%"],
    ["England", "33%", "+4.44%"],
  ],
};
doc.table( tableArray, { width: 300, }); // A4 595.28 x 841.89 (portrait) (about width sizes)

// move to down
doc.moveDown(); // separate tables

// -----------------------------------------------------------------------------------------------------
// Complex Table with Object
// -----------------------------------------------------------------------------------------------------
// A4 595.28 x 841.89 (portrait) (about width sizes)
const table = {
  headers: [
    { label:"Name", property: 'name', width: 60, renderer: null },
    { label:"Description", property: 'description', width: 150, renderer: null }, 
    { label:"Price 1", property: 'price1', width: 100, renderer: null }, 
    { label:"Price 2", property: 'price2', width: 100, renderer: null }, 
    { label:"Price 3", property: 'price3', width: 80, renderer: null }, 
    { label:"Price 4", property: 'price4', width: 63, renderer: (value, indexColumn, indexRow, row) => { return `U$ ${Number(value).toFixed(2)}` } },
  ],
  datas: [
  { description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', price1: '$1', price3: '$ 3', price2: '$2', price4: '4', name: 'Name 1', },
  { name: 'bold:Name 2', description: 'bold:Lorem ipsum dolor.', price1: 'bold:$1', price3: '$3', price2: '$2', price4: '4', options: { fontSize: 10, separation: true } },
  { name: 'Name 3', description: 'Lorem ipsum dolor.', price1: 'bold:$1', price4: '4.111111', price2: '$2', price3: { label:'PRICE $3', options: { fontSize: 12 } }, },
],
  rows: [
    [
      "Apple",
      "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
      "$ 105,99",
      "$ 105,99",
      "$ 105,99",
      "105.99",
    ],
    [
      "Tire",
      "Donec ac tincidunt nisi, sit amet tincidunt mauris. Fusce venenatis tristique quam, nec rhoncus eros volutpat nec. Donec fringilla ut lorem vitae maximus. Morbi ex erat, luctus eu nulla sit amet, facilisis porttitor mi.",
      "$ 105,99",
      "$ 105,99",
      "$ 105,99",
      "105.99",
    ],
  ],
};

doc.table(table, {
  prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
  prepareRow: (row, indexColumn, indexRow, rectRow) => {
  doc.font("Helvetica").fontSize(8);
  indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'blue' : 'green'), 0.15);
},
});

doc.moveDown(1);

const tableArrayColor = {
headers: ["Country", "Conversion rate", "Trend"],
rows: [
  ["Switzerland", "12%", "+1.12%"],
  ["France", "67%", "-0.98%"],
  ["Brazil", "88%", "2.77%"],
],
};
doc.table( tableArrayColor, { 

width: 400,
x: 150,
columnsSize: [200,100,100],

prepareRow: (row, indexColumn, indexRow, rectRow) => {
  doc.font("Helvetica").fontSize(10);
  indexColumn === 0 && doc.addBackground(rectRow, (indexRow % 2 ? 'red' : 'green'), 0.5);
},

}); // A4 595.28 x 841.89 (portrait) (about width sizes)


// if your run express.js server:
// HTTP response only to show pdf
// doc.pipe(res);

// done
doc.end();