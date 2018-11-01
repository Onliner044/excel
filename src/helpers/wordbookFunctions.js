import { utils } from 'xlsx';

/**
 * @return {object} Sheets
 * @param {object} customWorkbook customWorkbook
 */
export function createSheets(customWorkbook) {
  const sheets = {};

  Object.keys(customWorkbook).forEach((sheetName) => {
    const { cells, ref } = customWorkbook[sheetName];

    const data = {
      '!ref': ref,
    };

    Object.keys(cells).forEach((key) => {
      const value = cells[key].value;

      Object.assign(data, {
        [key]: {
          t: 's',
          v: value,
          w: value,
        },
      });
    });

    Object.assign(sheets, {
      [sheetName]: data,
    });
  });

  return sheets;
}

/**
 * @return {object} object
 * @param {object} sheet sheet
 */
export function getDataSheet(sheet) {
  let { ref } = sheet;
  if (!ref) {
    return {
      width: null,
      height: null,
    };
  }

  ref = ref.split(':');

  const cell = parseCell(ref[1] || ref[0]);
  const { width, height } = cell;

  return { width, height };
}

/**
 * @return {boolean} return true if format .xlsx/.xls/.csv
 * @param {string} fileName fileName
 */
export function checkFileFormat(fileName) {
  const format = getFormat(fileName);
  if (format === '') {
    return false;
  }

  switch (format) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      return true;

    default:
      return false;
  }
}

/**
 * @return {string} format
 * @param {string} fileName fileName
 */
export function getFormat(fileName) {
  const pointIndex = fileName.lastIndexOf('.');
  return fileName.substring(pointIndex + 1, fileName.length);
}

/**
 * @return {Object} object
 * @param {string} cell string cell
 */
function parseCell(cell) {
  let name = '';
  let number = '';

  for (let i = 0; i < cell.length; i++) {
    const val = cell[i];

    if (isNaN(+val)) {
      number += val;
    } else {
      name += val;
    }
  }

  return {
    width: utils.decode_col(number),
    height: utils.decode_row(name),
  };
}

/**
 * @return {boolean} isEqual
 * @param {object} customWorkbook customWorkbook
 * @param {object} initialWorkbook initialWorkbook
 */
export function isEqual(customWorkbook, initialWorkbook) {
  return Object.keys(customWorkbook).every((sheet) => {
    const cells1 = customWorkbook[sheet].cells;
    const cells2 = initialWorkbook[sheet].cells;

    console.log(cells1, cells2);

    const a = Object.keys(cells1).every((key) => {
      let value1;
      let value2;
      try {
        value1 = cells1[key].value;
        value2 = cells2[key].value;
      } catch (e) {
        return false;
      }

      console.log(value1, value2);

      if (value1 !== value2) {
        return false;
      }

      return true;
    });
    console.log('CHECK', a);
    return a;
  });
}
