/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { registerEnumType } from '@nestjs/graphql';

export enum OnlineStatusEnum {
  ONLINE = 'ONLINE',
  BUSY = 'BUSY',
  IDLE = 'IDLE',
  DO_NOT_DISTURB = 'DO_NOT_DISTURB',
  INVISIBLE = 'INVISIBLE',
  OFFLINE = 'OFFLINE',
}

registerEnumType(OnlineStatusEnum, { name: 'OnlineStatus' });
