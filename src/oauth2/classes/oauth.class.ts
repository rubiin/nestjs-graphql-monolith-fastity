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

import { randomBytes } from 'crypto';
import { AuthorizationCode } from 'simple-oauth2';
import { OAuthProvidersEnum } from '../../users/enums/oauth-providers.enum';
import { IAuthParams } from '../interfaces/auth-params.interface';
import { IClient } from '../interfaces/client.interface';
import { IProvider } from '../interfaces/provider.interface';

export class OAuthClass {
  private static readonly [OAuthProvidersEnum.MICROSOFT]: IProvider = {
    authorizeHost: 'https://login.microsoftonline.com',
    authorizePath: '/common/oauth2/v2.0/authorize',
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: '/common/oauth2/v2.0/token',
  };
  private static readonly [OAuthProvidersEnum.GOOGLE]: IProvider = {
    authorizeHost: 'https://accounts.google.com',
    authorizePath: '/o/oauth2/v2/auth',
    tokenHost: 'https://www.googleapis.com',
    tokenPath: '/oauth2/v4/token',
  };
  private static readonly [OAuthProvidersEnum.FACEBOOK]: IProvider = {
    authorizeHost: 'https://facebook.com',
    authorizePath: '/v9.0/dialog/oauth',
    tokenHost: 'https://graph.facebook.com',
    tokenPath: '/v9.0/oauth/access_token',
  };
  private static readonly [OAuthProvidersEnum.GITHUB]: IProvider = {
    authorizeHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
  };
  private static userDataUrls: Record<OAuthProvidersEnum, string> = {
    [OAuthProvidersEnum.GOOGLE]:
      'https://www.googleapis.com/oauth2/v3/userinfo',
    [OAuthProvidersEnum.MICROSOFT]: 'https://graph.microsoft.com/v1.0/me',
    [OAuthProvidersEnum.FACEBOOK]:
      'https://graph.facebook.com/v16.0/me?fields=email,name',
    [OAuthProvidersEnum.GITHUB]: 'https://api.github.com/user',
    [OAuthProvidersEnum.LOCAL]: '',
  };

  private readonly code: AuthorizationCode;
  private readonly authorization: IAuthParams;
  private readonly userDataUrl: string;

  constructor(
    private readonly provider: OAuthProvidersEnum,
    private readonly client: IClient,
    private readonly url: string,
  ) {
    if (provider === OAuthProvidersEnum.LOCAL) {
      throw new Error('Invalid provider');
    }

    this.code = new AuthorizationCode({
      client,
      auth: OAuthClass[provider],
    });
    this.authorization = OAuthClass.genAuthorization(provider, url);
    this.userDataUrl = OAuthClass.userDataUrls[provider];
  }

  public get state(): string {
    return this.authorization.state;
  }

  public get dataUrl(): string {
    return this.userDataUrl;
  }

  public get authorizationUrl(): string {
    return this.code.authorizeURL(this.authorization);
  }

  private static genAuthorization(
    provider: OAuthProvidersEnum,
    url: string,
  ): IAuthParams {
    const redirect_uri = `${url}/api/auth/ext/${provider}/callback`;
    const state = randomBytes(16).toString('hex');

    switch (provider) {
      case OAuthProvidersEnum.GOOGLE:
        return {
          state,
          redirect_uri,
          scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ],
        };
      case OAuthProvidersEnum.MICROSOFT:
        return {
          state,
          redirect_uri,
          scope: ['openid', 'profile', 'email'],
        };
      case OAuthProvidersEnum.FACEBOOK:
        return {
          state,
          redirect_uri,
          scope: ['email', 'public_profile'],
        };
      case OAuthProvidersEnum.GITHUB:
        return {
          state,
          redirect_uri,
          scope: ['user:email', 'read:user'],
        };
    }
  }

  public async getToken(code: string): Promise<string> {
    const result = await this.code.getToken({
      code,
      redirect_uri: this.authorization.redirect_uri,
      scope: this.authorization.scope,
    });
    return result.token.access_token as string;
  }
}
