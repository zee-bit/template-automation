const fs = require('fs');
const pdfkitlib = require("./pdfkit-from-json");
// const 

function populatePlaceholders(template, mapping) {
    const regex = new RegExp(`{{${placeholder}>`, 'g');

    // for(let component in template.data) {
    //     for 
    // }

    const replacePlaceholders = (str, placeholders) => {
        for (const placeholder in placeholders) {
            const regex = new RegExp(`<${placeholder}>`, 'g');
            str = str.replace(regex, placeholders[placeholder]);
        }
        return str;
    };

    const processObject = (obj, placeholders) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replacePlaceholders(obj[key], placeholders);
            } else if (typeof obj[key] === 'object') {
                processObject(obj[key], placeholders);
            }
        }
    };

    template.forEach((item) => {
        processObject(item, mapping);
    });

    return template;
}

function replacePlaceholders(template, data) {
    if (typeof template === 'string') {

        return template.replace(/{{(.*?)}}/g, (match, key) => {
            const keys = key.split('.');
            let value = data;
            for (const k of keys) {
                value = value[k];
                if (value === undefined) {
                    return match;
                }
            }
            return value;
        });
    }
    else if (Array.isArray(template)) {
        return template.map(item => replacePlaceholders(item, data));
    }
    else if (typeof template === 'object' && template !== null) {
        const result = {};
        for (const key in template) {
            if (template.hasOwnProperty(key)) {
                result[key] = replacePlaceholders(template[key], data);
            }
        }
        return result;
    }
    else {
        return template; // Return unchanged for other data types
    }
}

const replacePlaceholdersModified = (template, data) => {
    for(let obj of template.data) {
        for(let key in obj) {
            if((/{{(.*?)}}/g).test(obj[key])) {
                delimArr = obj[key].match(/{{(.*?)}}/g).map(delimiter => delimiter.slice(2,-2));



                obj[key] = obj[key].match(/{{(.*?)}}/g).map( val => { // val = {{add.line1.line2}}
                    let str = val.slice(2,-2);
                    currValue = data;
                    str.split('.').forEach(p => currValue = currValue[p]);
                    return currValue 
                }).join(' ');
            }
        }
    }
    return template;
}

// const populateTableEntries = (template, data) => {
//     let orderLineItems = [], lineItem = {}
//     for (let lineItem of data.orderLineItems) {
//         lineItem[]
//     }
// }


const populateTablesDynamically = (template, dataList, parentAttribute) => {
    let dynamicDataList = []
    for (const component of template.data) {
        if (component.type === "TABLE" && component.properties.parentAttribute === parentAttribute) {
            placeholderData = component.data[0]
            for (data of dataList) {
                populatedData = replacePlaceholders(placeholderData, data)
                populatedData.slNo = component.properties.startIndex++;
                dynamicDataList.push(populatedData)
            }
            component.data = [...dynamicDataList, ...component.data.slice(1)];
        }
    }
    return template;
}


// Read template JSON and mapping JSON from files
const templateJson = JSON.parse(fs.readFileSync('converted.json', 'utf-8'));
const mappingJson = JSON.parse(fs.readFileSync('mapping.json', 'utf-8'));


let finalTemplate = replacePlaceholders(templateJson,mappingJson);
for (const key in mappingJson) {
    if (Array.isArray(mappingJson[key])) {
        finalTemplate = populateTablesDynamically(finalTemplate, mappingJson[key], key);
    }
}

// Populate placeholders
// const updatedTemplate = populatePlaceholders(templateJson, mappingJson);

// Output the updated JSON
// console.log(JSON.stringify(newTemplate, null, 2));
pdfkitlib.generateInvoice(finalTemplate);
