/*
 This file is part of Nest GraphQL Fastify Template

 This project is dual-licensed under the Mozilla Public License 2.0 (MPLv2) and the
 GNU General Public License version 3 (GPLv3).

 You may use, distribute, and modify this file under the terms of either the MPLv2
 or GPLv3, at your option. If a copy of these licenses was not distributed with this
 file. You may obtain a copy of the licenses at https://www.mozilla.org/en-US/MPL/2.0/
 and https://www.gnu.org/licenses/gpl-3.0.en.html respectively.

 Copyright © 2023
 Afonso Barracha
*/

import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, Max, Min } from 'class-validator';
import { QueryOrderEnum } from '../enums/query-order.enum';

@ArgsType()
export abstract class FilterRelationDto {
  @Field(() => QueryOrderEnum, { defaultValue: QueryOrderEnum.ASC })
  @IsEnum(QueryOrderEnum)
  public order: QueryOrderEnum = QueryOrderEnum.ASC;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  public first = 10;
}
