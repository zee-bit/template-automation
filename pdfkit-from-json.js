// const PDFDocument = require('pdfkit-table');

// const fs = require('fs');
// const json = require('json');
// const QRCode = require('qrcode');

// let stream;

// const generateInvoice = () => {
//   const doc = new PDFDocument();

//   // Pipe the PDF output to a file
//   stream = fs.createWriteStream('invoice.pdf');
//   doc.pipe(stream);

//   // Logo
//   doc.image('damensch.png', 50, 50, { width: 100 });

//   // QR Code
//   QRCode.toDataURL('Your QR Code Data', (err, url) => {
//     if (err) throw err;
//     doc.image(url, 450, 50, { width: 100 });
//     generateContent(doc);
//     doc.end();
//   });
// };

const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const util = require('util');
const QRCode = require('qrcode');
const jsbarcode = require('jsbarcode');
const bwip = require('bwip-js')
// const dataUriToBuffer = require('data-uri-to-buffer');


const toDataURLAsync = util.promisify(QRCode.toDataURL);


const generateInvoice = async (jsonData) => {
  const doc = new PDFDocument(jsonData.pageProperties.options);

  const stream = fs.createWriteStream('invoice-from-json-final.pdf');
  // Pipe the PDF output to a file
  doc.pipe(stream);

  // Finalize and save the PDF
  // stream.on('finish', (res) => {
  //   console.log('Invoice created successfully.', res);
  // });

  // Loop through the data array in the JSON
  for (let item of jsonData.data) {
  // await jsonData.data.forEach(item => {
    switch (item.type) {
      case 'LOGO':
      	// Handle Logo
      	drawImage(doc, item);
      	break;

      case 'QR':
        // Handle QR Code
        // drawQRCode(doc, item);
        await generateQRCode(doc,item);
        break;

      case 'TEXT':
        // Handle Text
        drawText(doc, item);
        break;

      case 'ADDRESS':
        // Handle Address
        drawAddress(doc, item);
        break;

      case 'TABLE':
        // Handle Table
        if(item.properties.type === "NORMAL")
          drawStandardTable(doc,item)
        else
          drawTableLib(doc, item);
        break;

      case 'BARCODE':
        // Handle barcode
        await drawBarcode(doc, item);
        break;

      case 'LINE':
        drawLine(doc, item);
        break;

      case 'RECTANGLE':
        drawRectangle(doc, item);
        break;

      // Add more cases for other types if needed

      default:
        break;
    }
  };
  
  // Finalize and save the PDF
  stream.on('finish', (res) => {
    // doc.end();
    console.log('Invoice created successfully.', res);
  });

  doc.end();
};


const drawImage = (doc, item) => {
  doc.image(item.url, item.x, item.y, { width: item.width });
};


const generateQRCode = async (doc, item) => {

  try {
      const url = await toDataURLAsync(item.data, { margin : item.margin });
      doc.image(url, item.x, item.y, { width: item.width });

  } catch (error) {
      console.error('Error generating QR code:', error);
  }
};


const drawQRCode = async (doc, item) => {
  // QRCode.toDataURL("skjdskjcd")
  // .then(url => {
  //   doc.image(url, 400, 500, { width: 100 })
  // })
  // .catch(err => console.log(err));
  // QRCode.toBuffer("HUEHUE", (err, buff) => {
  //   if (err) console.log("error aa gya");
  //   doc.image(buff, 200, 100, { width: 100, height: 100 });
  //   doc.end();
  // })

  try {
      const url = await qrCodeAsync('Your QR Code Data');
      doc.image(url, 200, 50, { width: 100 });
      // doc.end();

      // Handle the 'finish' event of the stream
      // stream.on('finish', () => {
      //     console.log('Invoice created successfully.');
      // });
  } catch (error) {
      console.error('Error generating QR code:', error);
  }

//   QRCode.toString("HUEHUE",{type:'png'},
//                     function (err, QRcode) {
                      
//       console.log(108, err, QRCode);
//     if(err) return console.log("error occurred");
//     doc.image(QRCode, 100, 100, { width: 100, height: 100 });
 
//     // Printing the generated code
//     console.log(QRcode);
// })
   
// return;
	// QRCode.toDataURL('Your QR Code Data', (err, url) => {
  //   if (err) throw err;
  //   console.log("URL", url);
  //   const bf = Buffer.from(url.replace('data:image/png;base64,',''), 'base64');
  //   doc.image(bf, 150, 150);
  //   // doc.image(url, item.x, item.y, { width: item.width });
  // });
}


const drawBarcode = async (doc, item) => {
  
  // doc.moveTo(item.x, item.y);
  const data = item.data;
  const options = {
    bcid: 'code128', // Choose your barcode format (e.g., CODE39, EAN-13)
    text: item.data,
    width: item.width,
    height: item.height
  };
  await bwip.toBuffer(options).then(png => doc.image(png, item.x,item.y)).catch(err => console.log(err))
  // const buffer = jsbarcode(data, options).toBuffer();
  // const svgString = buffer.toString('utf-8');
  // doc.svg(svgString, item.x, item.y);
}

const generateBarcode = async (data, item) => {
  return new Promise((resolve, reject) => {
      bwip.toBuffer({
          bcid: 'code128',  // Barcode type
          text: item.data,       // Data to encode
          scale: 3,          // Scaling factor
          height: 10,        // Bar height
          includetext: true, // Include human-readable text
          textxalign: 'center', // Text alignment
      }, (err, png) => {
          if (err) {
              reject(err);
          } else {
              const base64 = `data:image/png;base64,${png.toString('base64')}`;
              resolve(base64);
          }
      });
  });
};


const drawQRCodeAsync = async (doc, item) => {
  try {
    const url = await QRCode.toDataURL('Actual QR Code Data');
    doc.image(url, item.x, item.y, { width: item.width });
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
};


const drawLine = (doc, item) => {
  doc.strokeColor('black');
  doc.lineWidth(item.lineWidth ? item.lineWidth : 0.7);
  doc.moveTo(item.x, item.y).lineTo(item.x2,item.y2).stroke();
}


const drawRectangle = (doc, item) => {
  doc.strokeColor('black');
  doc.lineWidth(item.lineWidth ? item.lineWidth : 0.6);
  doc.rect(item.x, item.y, (item.x2-item.x), (item.y2-item.y)).stroke();
}


const drawText = (doc, item) => {
  doc.font(item.font).fontSize(item.fontSize).text(item.text, item.x, item.y);
};


const drawAddress = (doc, item) => {
  const { header, data } = item;
  doc.font(header.font).fontSize(header.fontSize).text(header.text, header.x, header.y);
  drawAddressData(doc, data, data.x, data.y);
};


const drawAddressData = (doc, address, x, y) => {
  doc.font('Helvetica').fontSize(12).text(address.name, x, y);
  doc.text(address.street, x, y + 20);
  doc.text(`${address.city}, ${address.state} ${address.zip}`, x, y + 40);
};


const drawStandardTable = (doc, item) => {
  doc.x = item.properties.x;
  doc.y = item.properties.y;
	const table = {
		headers: item.headers,
		datas: item.data
	}
	doc.table(table, {
		  // x: 0,
		  prepareRow: (row, indexColumn, indexRow, rectRow) => {
		  doc.font("Helvetica").fontSize(8);
		},
	});
	doc.moveDown(1);
}


const drawTableLib = (doc, item) => {
	// doc.moveDown()
  // doc.text("", 0)
  doc.x = item.properties.x;
  doc.y = item.properties.y;
	const table = {
		headers: item.headers,
		datas: item.data
	}
	doc.table(table, {
		  // x: 0,
		  prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
		  prepareRow: (row, indexColumn, indexRow, rectRow) => {
		  doc.font("Helvetica").fontSize(8);
		},
	});
	doc.moveDown(1);
}


const drawTable = (doc, item) => {
  const { properties, headers, data } = item;
  const tableTop = properties.y || 50;
  const tableLeft = properties.x || 50;
  const rowHeight = properties.rowHeight || 20;
  const colWidths = headers.map(header => header.width);
  const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

  // Draw header
  drawTableRow(doc, headers.map(header => header.label), tableLeft, tableTop, colWidths, true);

  // Draw rows
  let currentY = tableTop + rowHeight;
  let remainingHeight = 750 - currentY; // Adjust the total height as needed

  data.forEach(item => {
    const rowData = headers.map(header => item[header.property]);
    drawTableRow(doc, rowData, tableLeft, currentY, colWidths);
    currentY += rowHeight;
    remainingHeight -= rowHeight;
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

// Load the JSON data from file
//const jsonData = require('./template.json');

// Generate the PDF
// generateInvoice(jsonData);


const finalTemplate = JSON.parse(fs.readFileSync('final_template.json', 'utf-8'));
generateInvoice(finalTemplate);

//module.exports = {generateInvoice};








// const QRCode = require('qrcode');
// const PDFDocument = require('pdfkit');
// const pdfkitTable = require('pdfkit-table');

// const { pageProperties, data } = require('./template.json'); // Replace with your data

// const doc = new PDFDocument({
//   size: pageProperties.options.size,
//   margin: pageProperties.options.margins,
// });

// function drawComponent(component) {
//   switch (component.type) {
//     case 'LOGO':
//       doc.image(component.url, component.x, component.y, { width: component.width });
//       break;
//     case 'QR':
//       // doc.qrcode(component.data, component.x, component.y, { width: component.width, height: component.height });
//       QRCode.toDataURL(component.data, (err, dataURL) => {
//         doc.image(dataURL, component.x, component.y, { width: component.width, height: component.height });
//       });
//       break;
//     case 'TEXT':
//       doc.fontSize(component.fontSize).font(component.font).text(component.text, component.x, component.y);
//       break;
//     case 'ADDRESS':
//       const header = component.header;
//       const data = component.data;
//       doc.fontSize(header.fontSize).font(header.font).text(header.text, header.x, header.y);
//       for (const key in data) {
//         doc.fontSize(12).text(`${key}: ${data[key]}`, data.x, data.y += 15);
//       }
//       break;
//     case 'TABLE':
//       const table = new pdfkitTable(doc, {
//         ...component.properties,
//       });
//       table.addHeaders(component.headers);
//       table.addBody(component.data);
//       table.draw()
//       // table.end();
//       // doc.text(table.render(), component.x, component.y);
//       break;
//     default:
//       throw new Error(`Unsupported component type: ${component.type}`);
//   }
// }

// data.forEach((component) => drawComponent(component));

// doc.pipe(fs.createWriteStream('template.pdf'));
// doc.end();

// console.log('PDF generated successfully!');

