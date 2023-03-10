/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { Module } from '@nestjs/common';
import { LoadersService } from './loaders.service';

@Module({
  providers: [LoadersService],
  exports: [LoadersService],
})
export class LoadersModule {}
