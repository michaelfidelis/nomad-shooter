import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { MatchesModule } from '../src/matches/matches.module';

const logData = `
    23/04/2019 15:34:22 - New match 11348965 has started
    23/04/2019 15:36:04 - Roman killed Nick using M16
    23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN
    23/04/2019 15:39:22 - Match 11348965 has ended`;

describe('MatchesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MatchesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/matches (POST)', () => {
    return request(app.getHttpServer())
      .post('/matches')
      .attach('file', Buffer.from(logData), 'match.log')
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveLength(4);
      });
  });
});
