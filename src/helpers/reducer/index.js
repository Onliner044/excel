import { combineReducers } from 'redux';

import customWorkbook from './customWorkbook';
import initialWorkbook from './initialWorkbook';
import originalWorkbook from './originalWorkbook';

export default combineReducers({
  customWorkbook,
  initialWorkbook,
  originalWorkbook,
});
