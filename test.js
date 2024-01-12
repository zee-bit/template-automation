// const PDFDocument = require('pdfkit-table');
// const fs = require('fs');
// const QRCode = require('qrcode');

// const doc = new PDFDocument();
// const stream = fs.createWriteStream('test.pdf');
// doc.pipe(stream);

// QRCode.toDataURL('Your QR Code Data', (err, url) => {
//     if (err) throw err;
//     console.log(url)
//     doc.image(url, 200, 50, { width: 100 })
// });

// doc.end()

// // Finalize and save the PDF
// stream.on('finish', (res) => {
//     console.log('Invoice created successfully.', res);
// });
const util = require('util');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const QRCode = require('qrcode');

// Promisify the QRCode.toDataURL function
const toDataURLAsync = util.promisify(QRCode.toDataURL);

const doc = new PDFDocument();
const stream = fs.createWriteStream('test.pdf');
doc.pipe(stream);

const generatePDF = async () => {
    // const doc = new PDFDocument();
    // const stream = fs.createWriteStream('test.pdf');
    // doc.pipe(stream);
    // await generateQR()
    const lst = [1]
    await lst.forEach(element => {
        generateQR()
    });

    // try {
    //     const url = await toDataURLAsync('Your QR Code Data');
    //     console.log(url);
    //     doc.image(url, 200, 50, { width: 100 });
    // } catch (error) {
    //     console.error('Error generating QR code:', error);
    // }

    // Handle the 'finish' event of the stream
    stream.on('finish', () => {
        console.log('Invoice created successfully.');
    });

    doc.end();
};

// Handle the 'finish' event of the stream
// stream.on('finish', () => {
//     console.log('Invoice created successfully.');
// });

// te

async function generateQR() {
    try {
        const url = await toDataURLAsync('Your QR Code Data');
        console.log(url);
        doc.image(url, 200, 50, { width: 100 });
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}

// Call the main function
generatePDF();
// doc.end()