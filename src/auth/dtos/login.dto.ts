/*
  Free and Open Source - MIT
  Copyright © 2023
  Afonso Barracha
*/

import { IsEmail, IsString, MinLength } from 'class-validator';

export abstract class LoginDto {
  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(1)
  public password: string;
}
