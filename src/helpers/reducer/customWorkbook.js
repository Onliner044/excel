import { READ_FILE_REQUEST, READ_FILE_RESPONSE, READ_FILE_RESPONSE_FAILURE } from '../saga/readFile';
import { REPLACE_CELL } from '../action/const';

const initialState = ({
  data: {},
});

const customWorkbook = (state = initialState, action) => {
  switch (action.type) {
    case READ_FILE_REQUEST:
      return Object.assign({}, {
        data: action.file,
      });
    case READ_FILE_RESPONSE:
      return Object.assign({}, {
        data: action.data,
      });
    case READ_FILE_RESPONSE_FAILURE:
      return Object.assign({}, {
        data: action.error,
      });

    case REPLACE_CELL:
      const { data } = state;
      const { id, sheetName, newValue } = action;
      const cell = data[sheetName].cells[id];

      if (cell) {
        if (newValue === '') {
          delete data[sheetName].cells[id];
        } else {
          cell.value = newValue;
        }
      } else {
        Object.assign(data[sheetName].cells, {
          [id]: {
            id,
            value: newValue,
          },
        });
      }

      return {
        data: { ...data },
      };

    default:
      return state;
  }
};

export default customWorkbook;
