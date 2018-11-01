import { REPLACE_CELL } from './const';

export const replaceCell = (id, sheetName, newValue) => ({
  id,
  sheetName,
  newValue,
  type: REPLACE_CELL,
});
