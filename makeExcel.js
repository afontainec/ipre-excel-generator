const excelbuilder = require('msexcel-builder-protobi');


const restoration = 'nothing';
const restorationParams = [0, 0];

const descriptor = 'LBP';
const output = 'auto';

const workbook = excelbuilder.createWorkbook('./', 'batch_demo.xlsx');

const numCol = 11;


function addHeading(s) {
  const titles = ['Compute', 'Image', 'Degradation', 'ParDeg1', 'ParDeg2', 'ParDeg3', 'Restoration', 'ParRes1', 'ParRes2', 'Descriptor', 'Output'];
  for (let i = 0; i < titles.length; i++) {
    s.set(i + 1, 1, titles[i]);
  }
}

function getParam(min, max, totalIterations, currentIteration) {
  const divider = Math.max(totalIterations - 1, 1);
  return (((max - min) / divider) * currentIteration) + min;
}


function addRows(sheet, degParams, degradation, images) {
  let index = 0;
  for (let k = 0; k < degParams[0].iteration; k++) {
    const degParam1 = getParam(degParams[0].min, degParams[0].max, degParams[0].iteration, k);
    for (let j = 0; j < degParams[1].iteration; j++) {
      const degParam2 = getParam(degParams[1].min, degParams[1].max, degParams[1].iteration, j);
      for (let l = 0; l < degParams[2].iteration; l++) {
        const degParam3 = getParam(degParams[2].min, degParams[2].max, degParams[2].iteration, l);
        for (let i = 0; i < images.length; i++) {
          sheet.set(1, index + 2, 1); // Compute
          sheet.numberFormat(1, index + 2, 1);
          sheet.set(2, index + 2, images[i]); // image
          sheet.set(3, index + 2, degradation); // degradation
          sheet.set(4, index + 2, degParam1); // degpar1
          sheet.set(5, index + 2, degParam2); // parDeg2
          sheet.set(6, index + 2, degParam3); // parDeg3
          sheet.set(7, index + 2, restoration); // Restoration
          sheet.set(8, index + 2, restorationParams[0]); // parRes1
          sheet.set(9, index + 2, restorationParams[1]); // parRes2
          sheet.set(10, index + 2, descriptor); // Descriptor
          sheet.set(11, index + 2, output); // Output
          index++;
        }
      }
    }
  }
}

const images = [1, 2, 3, 4, 5, 6, 7];
// const images = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66];

const degradation = 'scn';
const degParams = [{
  min: 5,
  max: 20,
  iteration: 16,
}, {
  min: 0,
  max: 0,
  iteration: 1,
}, {
  min: 0,
  max: 0,
  iteration: 1,
}];
const n = images.length;
let numRow = ((n * degParams[0].iteration) * degParams[1].iteration * degParams[2].iteration);
numRow += 1; // heading


// MAIN scripts

const sheet = workbook.createSheet('Sheet1', numCol, numRow);


addHeading(sheet);

addRows(sheet, degParams, degradation, images);


// Save it
workbook.save((err) => {
  if (err) {
    throw err;
  } else {
    console.log('congratulations, your workbook created');
  }
});
