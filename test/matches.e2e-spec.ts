import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { MatchesModule } from '../src/matches/matches.module';
import { OpenTelemetryModule } from 'nestjs-otel';

const logData = `
    23/04/2019 15:34:22 - New match 11348965 has started
    23/04/2019 15:36:04 - Roman killed Nick using M16
    23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN
    23/04/2019 15:39:22 - Match 11348965 has ended
  `;

describe('MatchesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MatchesModule, OpenTelemetryModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/matches (POST)', () => {
    it('should process successfully', () => {
      return request(app.getHttpServer())
        .post('/api/matches')
        .attach('file', Buffer.from(logData), 'match.log')
        .expect(201);
    });

    it.each(['json', 'pdf', 'csv'])(
      'should return an unsupported media type due to file type (%s)',
      (filetype) => {
        return request(app.getHttpServer())
          .post('/api/matches')
          .attach('file', Buffer.from(logData, 'hex'), {
            filename: `match-log.${filetype}`,
          })
          .expect(415);
      },
    );

    it('should return an BadRequest when file exceeds the limit', () => {
      return request(app.getHttpServer())
        .post('/api/matches')
        .attach('file', Buffer.from(logData.repeat(100000)), {
          filename: `match-log.log`,
        })
        .expect(400);
    });

    it('should return an BadRequest when no file is uploaded', () => {
      return request(app.getHttpServer()).post('/api/matches').expect(400);
    });
  });
});
