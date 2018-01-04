const excelbuilder = require('msexcel-builder-protobi');

let workbook;

function makeSheet(params) {
  const numCol = 4;
  const numRow = (params[0].iteration * params[1].iteration * params[2].iteration) + 1;
  workbook.createSheet('Sheet1', numCol, numRow);
}

function getSheet(params) {
  workbook = excelbuilder.createWorkbook('./', 'parameters.xlsx');
  return makeSheet(params);
}

function getParam(min, max, totalIterations, currentIteration) {
  const divider = Math.max(totalIterations - 1, 1);
  return (((max - min) / divider) * currentIteration) + min;
}


function addRows(sheet, params) {
  let index = 0;
  for (let k = 0; k < params[0].iteration; k++) {
    const param1 = getParam(params[0].min, params[0].max, params[0].iteration, k);
    for (let j = 0; j < params[1].iteration; j++) {
      const param2 = getParam(params[1].min, params[1].max, params[1].iteration, j);
      for (let l = 0; l < params[2].iteration; l++) {
        const param3 = getParam(params[2].min, params[2].max, params[2].iteration, l);
        let s = 1;
        sheet.set(s++, index + 2, index); // id
        sheet.set(s++, index + 2, 3); // Number of params
        sheet.set(s++, index + 2, param1); // param1
        sheet.set(s++, index + 2, param2); // param2
        sheet.set(s++, index + 2, param3); // param3
        index++;
      }
    }
  }
}

function addHeading(s) {
  const titles = ['id', 'N', 'Param1', 'Param2', 'Param3'];
  for (let i = 0; i < titles.length; i++) {
    s.set(i + 1, 1, titles[i]);
  }
}

exports.generate = (params) => {
  const sheet = getSheet(params);
  addHeading(sheet);
  addRows(sheet, params);
};
