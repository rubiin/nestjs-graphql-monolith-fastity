/*
 This file is part of Nest GraphQL Fastify Template

 This Source Code Form is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.

 Copyright © 2023
 Afonso Barracha
*/

import { Embeddable, Property } from '@mikro-orm/core';
import dayjs from 'dayjs';
import { ICredentials } from '../interfaces/credentials.interface';

@Embeddable()
export class CredentialsEmbeddable implements ICredentials {
  @Property({ default: 0 })
  public version: number = 0;

  @Property({ default: '' })
  public lastPassword: string = '';

  @Property({ default: dayjs().unix() })
  public passwordUpdatedAt: number = dayjs().unix();

  @Property({ default: dayjs().unix() })
  public updatedAt: number = dayjs().unix();

  constructor(isConfirmed = false) {
    this.version = isConfirmed ? 1 : 0;
  }

  public updatePassword(password: string): void {
    this.version++;
    this.lastPassword = password;
    const now = dayjs().unix();
    this.passwordUpdatedAt = now;
    this.updatedAt = now;
  }

  public updateVersion(): void {
    this.version++;
    this.updatedAt = dayjs().unix();
  }
}
