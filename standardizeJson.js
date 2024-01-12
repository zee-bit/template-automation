const fs = require('fs');

// Read the original JSON file
const originalJson = require('./Gridster.json');
const DEFAULT_FONT = 'Helvetica';
const DEFAULT_FONT_SIZE = 10;

// Function to convert component data to the new format
function convertComponentData(component) {
  const typeMap = {
    'text': 'TEXT',
    'line': 'LINE',
    'image': 'IMAGE',
    'table': 'TABLE',
    'barcode': 'BARCODE',
    'qr': "QR",
    // Add more mappings for other component types as needed
  };

  const newData = {
    type: typeMap[component.componentType],
    x: component.dashboard.x,
    y: component.dashboard.y,
    width: component.dashboard.cols,
    height: component.dashboard.rows,
  };

  switch (component.componentType) {
    case 'image':
        // Handle Logo
        newData.url = component.componentData.url;
        break;

    case 'qr':
      // Handle QR Code
      
      break;

    case 'text':
      // Handle Text
      newData.text = component.componentData.editorContent;
      newData.font = component.componentData.font ? component.componentData.font : DEFAULT_FONT;
      newData.fontSize = component.componentData.fontSize ? component.componentData.fontSize : DEFAULT_FONT_SIZE;
      newData.fontWeight = component.componentData.fontWeight ? component.componentData.fontWeight : 'normal';
      break;

    case 'table':
      // Handle Table
      drawTableLib(doc, item);
      break;

    case 'barcode':
      // Handle barcode
      newData.data = component.componentData.value;
      newData.options = component.bcOpts;
      break;

    case 'line':
      newData.x2 = component.componentData.col;
      newData.y2 = component.componentData.row;
      break;

    // Add more cases for other types if needed

    default:
      break;
  }

//   if (component.componentType === 'text') {
//     newData.text = component.componentData.editorContent;
//     newData.font = 'Helvetica';
//     newData.fontSize = 10;
//   } else if (component.componentType === 'barcode') {
//     newData.data = component.componentData.value;
//   }

  return newData;
}

// Function to convert the entire JSON structure
function convertJson(originalJson) {
  const convertedJson = {
    pageProperties: {
      options: {
        size: 'A4',
        displayTitle: 'test-invoice',
        layout: 'portrait',
        margins: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
    },
    data: originalJson.template.map(convertComponentData),
  };

  return convertedJson;
}

// Convert the JSON
const convertedJson = convertJson(originalJson);

// Write the converted JSON to a new file
fs.writeFileSync('./converted.json', JSON.stringify(convertedJson, null, 2));

console.log('Conversion complete. Check converted.json');
