/*
 This file is part of Nest GraphQL Fastify Template

 This Source Code Form is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.

 Copyright © 2023
 Afonso Barracha
*/

import { LoadStrategy } from '@mikro-orm/core';
import { defineConfig as definePGConfig } from '@mikro-orm/postgresql';
import { defineConfig as defineSqliteConfig } from '@mikro-orm/sqlite';
import { IConfig } from './interfaces/config.interface';
import { redisUrlToOptions } from './utils/redis-url-to-options.util';
import { isUndefined } from './utils/validation.util';

export function config(): IConfig {
  const testing = process.env.NODE_ENV !== 'production';
  const bucketBase = `${process.env.BUCKET_REGION}.${process.env.BUCKET_HOST}.com`;
  const baseORMOptions = {
    entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
    entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
    loadStrategy: LoadStrategy.JOINED,
    allowGlobalContext: true,
  };
  return {
    port: parseInt(process.env.PORT, 10),
    url: process.env.URL,
    domain: process.env.DOMAIN,
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
      },
    },
    emailService: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    },
    bucketConfig: {
      forcePathStyle: false,
      region: process.env.BUCKET_REGION,
      endpoint: `https://${bucketBase}`,
      credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY,
      },
    },
    bucketData: {
      uuid: process.env.BUCKET_UUID,
      name: process.env.BUCKET_NAME,
      url: `https://${process.env.BUCKET_NAME}.${bucketBase}/`,
    },
    db: testing
      ? defineSqliteConfig({ ...baseORMOptions, dbName: ':memory:' })
      : definePGConfig({
          ...baseORMOptions,
          clientUrl: process.env.DATABASE_URL,
        }),
    redis: testing ? undefined : redisUrlToOptions(process.env.REDIS_URL),
    ttl: parseInt(process.env.REDIS_CACHE_TTL, 10),
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10),
      maxFiles: parseInt(process.env.MAX_FILES, 10),
    },
    sessionTime: parseInt(process.env.WS_TIME, 10),
    throttler: {
      ttl: parseInt(process.env.THROTTLE_TTL, 10),
      limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    },
    twoFactorTime: parseInt(process.env.TWO_FACTOR_TIME, 10),
    testing,
    oauth2: {
      microsoft:
        isUndefined(process.env.MICROSOFT_CLIENT_ID) ||
        isUndefined(process.env.MICROSOFT_CLIENT_SECRET)
          ? null
          : {
              id: process.env.MICROSOFT_CLIENT_ID,
              secret: process.env.MICROSOFT_CLIENT_SECRET,
            },
      google:
        isUndefined(process.env.GOOGLE_CLIENT_ID) ||
        isUndefined(process.env.GOOGLE_CLIENT_SECRET)
          ? null
          : {
              id: process.env.GOOGLE_CLIENT_ID,
              secret: process.env.GOOGLE_CLIENT_SECRET,
            },
      facebook:
        isUndefined(process.env.FACEBOOK_CLIENT_ID) ||
        isUndefined(process.env.FACEBOOK_CLIENT_SECRET)
          ? null
          : {
              id: process.env.FACEBOOK_CLIENT_ID,
              secret: process.env.FACEBOOK_CLIENT_SECRET,
            },
      github:
        isUndefined(process.env.GITHUB_CLIENT_ID) ||
        isUndefined(process.env.GITHUB_CLIENT_SECRET)
          ? null
          : {
              id: process.env.GITHUB_CLIENT_ID,
              secret: process.env.GITHUB_CLIENT_SECRET,
            },
    },
  };
}
