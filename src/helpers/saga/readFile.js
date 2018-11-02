import { takeEvery, call, put } from 'redux-saga/effects';
import XLSX from 'xlsx';
import { checkFileFormat } from '../wordbookFunctions';
import { setInitialWorkbook, setOriginalWorkbook } from '../action/workbook';

export const READ_FILE_REQUEST = 'READ_FILE_REQUEST';
export const READ_FILE_RESPONSE = 'READ_FILE_RESPONSE';
export const READ_FILE_RESPONSE_FAILURE = 'READ_FILE_FAILURE_RESPONSE';

export const readFileRequest = file => ({
  file,
  type: READ_FILE_REQUEST,
});

const readFileResponse = data => ({
  data,
  type: READ_FILE_RESPONSE,
});

const readFileFailureResponse = error => ({
  error,
  type: READ_FILE_RESPONSE_FAILURE,
});

/**
 * @return {promise} promise
 * @param {File} file file
 */
function readFile(file) {
  return new Promise((response, reject) => {
    const isFormat = checkFileFormat(file.name);
    if (!isFormat) {
      throw new Error('Неверный формат файла!');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      response(workbook);
    };

    reader.onerror = (e) => {
      reject(e);
    };

    if (file !== undefined) {
      reader.readAsBinaryString(file);
    }
  });
}

/**
 * @return {void} fetchReadFile
 * @param {array} params params
 */
function* fetchReadFile(params) {
  try {
    const workbook = yield call(readFile, params.file);

    const sheetsNames = workbook.SheetNames;
    const sheets = workbook.Sheets;

    const data = {};
    sheetsNames.forEach((name) => {
      const sheet = sheets[name];

      const cells = {};
      Object.keys(sheet).forEach((key) => {
        const el = sheet[key];

        if (el.hasOwnProperty('v')) {
          Object.assign(cells, {
            [key]: {
              id: key,
              value: el.v.toString(),
            },
          });
        }
      });

      let ref = sheet['!ref'];
      if (!ref) {
        ref = null;
      }

      const customSheet = {
        name,
        ref,
        cells,
      };
      Object.assign(data, { [name]: customSheet });
    });

    const cloneData = JSON.parse(JSON.stringify(data));

    yield put(setOriginalWorkbook(workbook));
    yield put(setInitialWorkbook(cloneData));
    yield put(readFileResponse(data));
  } catch (error) {
    yield put(readFileFailureResponse(error));
  }
}

/**
 * @return {void} watchReadFile
 */
export default function* watchReadFile() {
  yield takeEvery(READ_FILE_REQUEST, fetchReadFile);
}
