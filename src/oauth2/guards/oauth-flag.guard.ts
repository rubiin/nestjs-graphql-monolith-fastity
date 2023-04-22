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

import {
  CanActivate,
  ExecutionContext,
  mixin,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { isNull } from '../../config/utils/validation.util';
import { OAuthProvidersEnum } from '../../users/enums/oauth-providers.enum';
import { IClient } from '../interfaces/client.interface';

export const OAuthFlagGuard = (
  provider: OAuthProvidersEnum,
): Type<CanActivate> => {
  class OAuthFlagGuardClass implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    public canActivate(context: ExecutionContext): boolean {
      const client = this.configService.get<IClient | null>(
        `oauth2.${provider}`,
      );

      if (isNull(client)) {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        throw new NotFoundException(`Cannot ${request.method} ${request.url}`);
      }

      return true;
    }
  }

  return mixin(OAuthFlagGuardClass);
};
