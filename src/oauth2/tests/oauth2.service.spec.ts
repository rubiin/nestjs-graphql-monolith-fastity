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

import { faker } from '@faker-js/faker';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { isJWT } from 'class-validator';
import { v4 } from 'uuid';
import { CommonModule } from '../../common/common.module';
import { CommonService } from '../../common/common.service';
import { config } from '../../config';
import { MikroOrmConfig } from '../../config/mikroorm.config';
import { validationSchema } from '../../config/validation.config';
import { JwtModule } from '../../jwt/jwt.module';
import { OAuthProvidersEnum } from '../../users/enums/oauth-providers.enum';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { Oauth2Service } from '../oauth2.service';

process.env.MICROSOFT_CLIENT_ID = v4();
process.env.MICROSOFT_CLIENT_SECRET = v4();
process.env.GOOGLE_CLIENT_ID = v4();
process.env.GOOGLE_CLIENT_SECRET = v4();
process.env.FACEBOOK_CLIENT_ID = v4();
process.env.FACEBOOK_CLIENT_SECRET = v4();
process.env.GITHUB_CLIENT_ID = v4();
process.env.GITHUB_CLIENT_SECRET = v4();

describe('Oauth2Service', () => {
  let module: TestingModule,
    oauth2Service: Oauth2Service,
    usersService: UsersService,
    commonService: CommonService,
    orm: MikroORM;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema,
          load: [config],
        }),
        CacheModule.register({
          isGlobal: true,
          ttl: parseInt(process.env.JWT_REFRESH_TIME, 10),
        }),
        MikroOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: MikroOrmConfig,
        }),
        CommonModule,
        UsersModule,
        JwtModule,
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 5,
        }),
      ],
      providers: [Oauth2Service, CommonModule],
    }).compile();

    oauth2Service = module.get<Oauth2Service>(Oauth2Service);
    usersService = module.get<UsersService>(UsersService);
    commonService = module.get<CommonService>(CommonService);
    orm = module.get<MikroORM>(MikroORM);
    await orm.getSchemaGenerator().createSchema();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
    expect(oauth2Service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(commonService).toBeDefined();
    expect(orm).toBeDefined();
  });

  describe('getAuthorizationUrl', () => {
    it('should return the microsoft authorization url', () => {
      const url = oauth2Service.getAuthorizationUrl(
        OAuthProvidersEnum.MICROSOFT,
      );
      expect(url).toBeDefined();
      expect(url).toContain(
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      );
    });
    it('should return the google authorization url', () => {
      const url = oauth2Service.getAuthorizationUrl(OAuthProvidersEnum.GOOGLE);
      expect(url).toBeDefined();
      expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    });
    it('should return the facebook authorization url', () => {
      const url = oauth2Service.getAuthorizationUrl(
        OAuthProvidersEnum.FACEBOOK,
      );
      expect(url).toBeDefined();
      expect(url).toContain('https://facebook.com/v9.0/dialog/oauth');
    });
    it('should return the github authorization url', () => {
      const url = oauth2Service.getAuthorizationUrl(OAuthProvidersEnum.GITHUB);
      expect(url).toBeDefined();
      expect(url).toContain('https://github.com/login/oauth/authorize');
    });
  });

  describe('login', () => {
    const email = faker.internet.email();
    const name = faker.name.fullName();

    it('should create a new user', async () => {
      const [accessToken, refreshToken] = await oauth2Service.login(
        OAuthProvidersEnum.GOOGLE,
        email,
        name,
      );

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(isJWT(accessToken)).toBeTruthy();
      expect(isJWT(refreshToken)).toBeTruthy();

      const user = await usersService.findOneByEmail(email);
      expect(user).toBeDefined();
      expect(user.confirmed).toBeTruthy();
      expect(user.id).toStrictEqual(1);

      const providers = await usersService.findOAuthProviders(user.id);
      expect(providers).toBeDefined();
      expect(providers).toHaveLength(1);
      expect(providers[0].provider).toBe(OAuthProvidersEnum.GOOGLE);
    });

    it('should login an existing user', async () => {
      const [accessToken, refreshToken] = await oauth2Service.login(
        OAuthProvidersEnum.MICROSOFT,
        email,
        name,
      );

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(isJWT(accessToken)).toBeTruthy();
      expect(isJWT(refreshToken)).toBeTruthy();

      const user = await usersService.findOneByEmail(email);
      expect(user).toBeDefined();
      expect(user.confirmed).toBeTruthy();
      expect(user.id).toStrictEqual(1);
      const providers = await usersService.findOAuthProviders(user.id);
      expect(providers).toBeDefined();
      expect(providers).toHaveLength(2);
      expect(providers[0].provider).toBe(OAuthProvidersEnum.GOOGLE);
      expect(providers[1].provider).toBe(OAuthProvidersEnum.MICROSOFT);
    });
  });

  afterAll(async () => {
    await orm.getSchemaGenerator().dropSchema();
    await orm.close(true);
    await module.close();
  });
});
