import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { OpenTelemetryModule } from 'nestjs-otel';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, OpenTelemetryModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();

    /* eslint-disable @typescript-eslint/ban-ts-comment */ /* eslint-disable @typescript-eslint/no-unsafe-call */
    // @ts-ignore

    app.setViewEngine('hbs');
    /* eslint-enable @typescript-eslint/ban-ts-comment */ /* eslint-enable @typescript-eslint/no-unsafe-call */

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
