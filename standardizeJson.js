const fs = require('fs');

// Read the original JSON file
const originalJson = require('./gridster_invoice.json');
// const { width } = require('pdfkit/js/page');
const { compileFunction } = require('vm');
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
    'rectangle': 'RECTANGLE',
    'qrcode': "QR",
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
        newData.url = component.componentData.imgUrl;
        break;

    case 'qrcode':
      // Handle QR Code
      newData.data = component.componentData.qrData;
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
      newData.properties = setProperties(component);
      newData.headers = setHeaders(component.componentData);
      newData.data = setRows(component.componentData);
      break;

    case 'barcode':
      // Handle barcode
      newData.data = component.componentData.value;
      newData.options = component.bcOpts;
      break;

    case 'shape':
      // Handle all shapes
      switch (component.componentData.type) {
        case 'line':
          // Handle line shape
          newData.type = 'LINE';
          newData.x = component.dashboard.x;
          newData.y = component.dashboard.y;
          newData.x2 = newData.x + component.dashboard.cols;
          newData.y2 = newData.y + component.dashboard.rows;
          break;

        case 'rectangle':
          // Handle rectangle shape
          newData.type = 'RECTANGLE';
          newData.x = component.dashboard.x;
          newData.y = component.dashboard.y;
          newData.x2 = newData.x + component.dashboard.cols;
          newData.y2 = newData.y + component.dashboard.rows;
          break;

        default:
          break;

      }
      break;

    case 'line':
      // Handle line
      newData.x = component.dashboard.x1;
      newData.y = component.dashboard.y1;
      newData.x2 = newData.x + component.dashboard.cols;
      newData.y2 = newData.y + component.dashboard.rows;
      break;

    case 'rectangle':
      // Handle rectangle shape
      newData.x = component.dashboard.x1;
      newData.y = component.dashboard.y1;
      newData.x2 = newData.x + component.dashboard.cols;
      newData.y2 = newData.y + component.dashboard.rows;

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


function setProperties(component) {
  let properties = {}
  properties.x = component.dashboard.x;
  properties.y = component.dashboard.y;
  properties.startIndex = component.componentData.startIndex ? component.componentData.startIndex : 1;
  properties.parentAttribute = component.componentData.parentAttribute;
  return properties;
}


function setHeaders(componentData) {
  let headers = []
  let headerKeyPrefix = "0.";
  for (let i=0; i < componentData.cols; i++) {
    let headerKey = headerKeyPrefix + i;
    width = componentData.data[headerKey].width;
    value = componentData.data[headerKey].value;
    attributeKey = componentData.data[headerKey].attributeKey;
    let header = {
      "label": value,
      "property": attributeKey,
      "width": width,
      "attributeKey": attributeKey,
      "renderer": null
    }
    headers.push(header)
  }
  return headers;
}


function setRows(componentData) {
  let datas = []
  for (let i=1; i < componentData.rows; i++) {
    let row = {}
    let dataKeyPrefix = i + ".";
    for (let j=0; j < componentData.cols; j++) {
      let headerKey = "0." + j;
      let dataKey = dataKeyPrefix + j;
      attributeKey = componentData.data[headerKey].attributeKey;
      row[attributeKey] = componentData.data[dataKey].value;
      // width = componentData.data.get(dataKey).width;
      // value = componentData.data.get(dataKey).value;
      // attributeKey = componentData.data.get(dataKey).attributeKey;
      // let row = {
      //   ""
      // }
      // let header = {
      //   "label": value,
      //   "property": value,
      //   "width": width,
      //   "attributeKey": attributeKey,
      //   "renderer": null
      // }
      // headers.push(header)
    }
    datas.push(row);
  }
  return datas;
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
fs.writeFileSync('./standard.json', JSON.stringify(convertedJson, null, 2));

console.log('Conversion to standard template complete. Check standard.json');
