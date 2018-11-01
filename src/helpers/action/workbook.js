import { SET_INITIAL_WORKBOOK, SET_ORIGINAL_WORKBOOK } from './const';

export const setInitialWorkbook = data => ({
  data,
  type: SET_INITIAL_WORKBOOK,
});

export const setOriginalWorkbook = data => ({
  data,
  type: SET_ORIGINAL_WORKBOOK,
});
