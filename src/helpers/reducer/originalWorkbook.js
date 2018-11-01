import { SET_ORIGINAL_WORKBOOK } from '../action/const';

const initialState = ({
  data: {},
});

const originalWorkbook = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORIGINAL_WORKBOOK:
      return Object.assign({}, {
        data: action.data,
      });

    default:
      return state;
  }
};

export default originalWorkbook;
