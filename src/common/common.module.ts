/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
