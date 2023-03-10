/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { QueryCursorEnum } from './query-cursor.enum';

export enum CursorTypeEnum {
  DATE = 'DATE',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export const getCursorType = (cursor: QueryCursorEnum) =>
  cursor === QueryCursorEnum.DATE
    ? CursorTypeEnum.NUMBER
    : CursorTypeEnum.STRING;
