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
import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from '../common.service';
import { CursorTypeEnum } from '../enums/cursor-type.enum';

interface IData {
  id: number;
  name: string;
  email: string;
}

const data: IData[] = new Array(50).fill(null).map((_, i) => ({
  id: i + 1,
  name: faker.name.fullName(),
  email: faker.internet.email(),
}));

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  describe('paginate', () => {
    it('should cursor paginate the first 15 entities', () => {
      const paged = service.paginate(data.slice(0, 15), 50, 0, 'id', 15);
      const first = paged.edges[0];
      expect(first.cursor).toBe(Buffer.from('1', 'utf-8').toString('base64'));
      expect(
        service.decodeCursor(paged.pageInfo.endCursor, CursorTypeEnum.NUMBER),
      ).toBe(15);
      expect(paged.pageInfo.hasNextPage).toBe(true);
      expect(paged.pageInfo.hasPreviousPage).toBe(false);
      expect(paged.pageInfo.startCursor).toBe(first.cursor);
      expect(paged.pageInfo.endCursor).toBe(
        Buffer.from('15', 'utf-8').toString('base64'),
      );
    });

    it('should paginate the last 10 entities', () => {
      const paged = service.paginate(data.slice(39), 10, 40, 'id', 10);
      const first = paged.edges[0];

      expect(first.cursor).toBe(Buffer.from('40', 'utf-8').toString('base64'));
      expect(
        service.decodeCursor(paged.pageInfo.endCursor, CursorTypeEnum.NUMBER),
      ).toBe(50);
      expect(paged.pageInfo.hasNextPage).toBe(false);
      expect(paged.pageInfo.hasPreviousPage).toBe(true);
    });
  });

  describe('formatTitle', () => {
    it('should format a title', () => {
      const hello = 'hello whole world';
      expect(service.formatTitle(hello)).toBe('Hello Whole World');
    });

    it('should format very bad title', () => {
      const veryBad = '\nvery\nbad     \n\n\n\n\n\n\n\n';
      expect(service.formatTitle(veryBad)).toBe('Very Bad');
    });

    it('should format a lot of spaces', () => {
      const loadsOfSpaces =
        '              Loads             of                 Spaces                   \n';
      expect(service.formatTitle(loadsOfSpaces)).toBe('Loads Of Spaces');
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
