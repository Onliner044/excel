import { SET_INITIAL_WORKBOOK } from '../action/const';

const initialState = ({
  data: {},
});

const initialWorkbook = (state = initialState, action) => {
  switch (action.type) {
    case SET_INITIAL_WORKBOOK:
      console.dir(action.data);
      return Object.assign({}, {
        data: action.data,
      });

    default:
      return state;
  }
};

export default initialWorkbook;
