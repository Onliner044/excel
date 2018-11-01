import { call, all } from 'redux-saga/effects';

import readFile from './readFile';

/**
 * @return {void} saga
 */
export default function* saga() {
  return yield all([
    call(readFile),
  ]);
}
