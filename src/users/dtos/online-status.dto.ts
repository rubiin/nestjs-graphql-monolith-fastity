/*
 This file is part of Nest GraphQL Fastify Template

 This Source Code Form is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.

 Copyright © 2023
 Afonso Barracha
*/

import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { OnlineStatusEnum } from '../enums/online-status.enum';

@ArgsType()
export abstract class OnlineStatusDto {
  @Field(() => OnlineStatusEnum)
  @IsEnum(OnlineStatusEnum)
  public readonly onlineStatus: OnlineStatusEnum;
}
