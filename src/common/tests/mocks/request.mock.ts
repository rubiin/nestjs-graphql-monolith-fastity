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

import { FastifyRequest } from 'fastify';

class RequestMock {
  public cookies: Record<string, string> = {};
  public headers: Record<string, Record<string, string>> = {};

  public setCookie(name: string, value: string): void {
    this.cookies[name] = value;
  }

  public removeCookie(name: string): void {
    delete this.cookies[name];
  }

  public unsignCookie(cookie: string): { value: string; valid: boolean } {
    const value = Object.values(this.cookies).find((c) => c === cookie);
    return { value, valid: true };
  }
}

interface ExtendedRequestMock extends FastifyRequest {
  setCookie: (name: string, value: string) => void;
  removeCookie: (name: string) => void;
}

export const createRequestMock = (): ExtendedRequestMock =>
  new RequestMock() as unknown as ExtendedRequestMock;
