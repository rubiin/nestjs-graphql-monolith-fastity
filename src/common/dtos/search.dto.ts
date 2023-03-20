/*
 Free and Open Source - GNU GPLv3

 This file is part of nestjs-graphql-fastify-template

 nestjs-graphql-fastify-template is distributed in the
 hope that it will be useful, but WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY
 or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 General Public License for more details.

 Copyright © 2023
 Afonso Barracha
*/

import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { NAME_REGEX } from '../constants/regex';
import { PaginationDto } from './pagination.dto';

@ArgsType()
export abstract class SearchDto extends PaginationDto {
  @Field(() => String, { nullable: true })
  @IsString()
  @Length(1, 100, {
    message: 'Search needs to be between 1 and 100 characters',
  })
  @Matches(NAME_REGEX, {
    message: 'Search can only contain letters, numbers and spaces',
  })
  @IsOptional()
  public search?: string;
}
