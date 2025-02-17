import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LogEntry } from 'src/common/dtos/log-entry.dto';
import { MatchesService } from './matches.service';

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return right players list', () => {
    const logEntries: LogEntry[] = [
      {
        datetime: new Date('2019-04-23T18:34:22.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:34:22.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T18:36:04.000Z'),
        eventType: 'player',
        event: {
          killer: 'Roman',
          victim: 'Nick',
          weapon: 'M16',
          datetime: new Date('2019-04-23T18:36:04.000Z'),
        },
      },
      {
        datetime: new Date('2019-04-23T18:37:00.000Z'),
        eventType: 'player',
        event: {
          killer: 'Michael',
          victim: 'Jojo',
          weapon: 'M16',
          datetime: new Date('2019-04-23T18:37:00.000Z'),
        },
      },
      {
        datetime: new Date('2019-04-23T18:37:02.000Z'),
        eventType: 'player',
        event: {
          killer: 'Michael',
          victim: 'Amanda',
          weapon: 'M16',
          datetime: new Date('2019-04-23T18:37:02.000Z'),
        },
      },
      {
        datetime: new Date('2019-04-23T18:38:02.000Z'),
        eventType: 'player',
        event: {
          killer: '<WORLD>',
          victim: 'Michael',
          weapon: 'FALL',
          datetime: new Date('2019-04-23T18:38:02.000Z'),
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:22.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:22.000Z'),
          type: 'ended',
        },
      },
    ];

    const match = service.calculateRankings(logEntries);
    const playerNames = Object.keys(match.getPlayers());
    expect(playerNames).toEqual(['Nick', 'Roman', 'Jojo', 'Michael', 'Amanda']);
  });

  it('should return error when first event is not a match start event', () => {
    const logEntries: LogEntry[] = [
      {
        datetime: new Date('2019-04-23T18:59:22.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:22.000Z'),
          type: 'ended',
        },
      },
    ];

    expect(() => service.calculateRankings(logEntries)).toThrow(
      new BadRequestException('The first event must be a match start event'),
    );
  });

  it('should return and error when matches do not end', () => {
    const logEntries: LogEntry[] = [
      {
        datetime: new Date('2019-04-23T18:59:22.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:22.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:23.000Z'),
        eventType: 'match',
        event: {
          id: 11348966,
          datetime: new Date('2019-04-23T18:59:23.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:24.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:24.000Z'),
          type: 'ended',
        },
      },
    ];

    expect(() => service.calculateRankings(logEntries)).toThrow(
      new BadRequestException(
        `There is no ending event for the following matches: 11348965`,
      ),
    );
  });

  it('should return and error when matches do not start', () => {
    const logEntries: LogEntry[] = [
      {
        datetime: new Date('2019-04-23T18:59:22.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:22.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:23.000Z'),
        eventType: 'match',
        event: {
          id: 11348966,
          datetime: new Date('2019-04-23T18:59:23.000Z'),
          type: 'ended',
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:24.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:59:24.000Z'),
          type: 'ended',
        },
      },
    ];

    expect(() => service.calculateRankings(logEntries)).toThrow(
      new BadRequestException(
        `The match with id 11348966 does not have a start event`,
      ),
    );
  });

  it('should return and error when there is no active round', () => {
    const logEntries: LogEntry[] = [
      {
        datetime: new Date('2019-04-23T18:50:00.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:50:00.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T18:55:00.000Z'),
        eventType: 'match',
        event: {
          id: 11348965,
          datetime: new Date('2019-04-23T18:55:00.000Z'),
          type: 'ended',
        },
      },
      {
        datetime: new Date('2019-04-23T18:59:00.000Z'),
        eventType: 'player',
        event: {
          killer: 'Roman',
          victim: 'Nick',
          weapon: 'M16',
          datetime: new Date('2019-04-23T18:59:00.000Z'),
        },
      },
      {
        datetime: new Date('2019-04-23T19:00:00.000Z'),
        eventType: 'match',
        event: {
          id: 11348966,
          datetime: new Date('2019-04-23T19:00:00.000Z'),
          type: 'started',
        },
      },
      {
        datetime: new Date('2019-04-23T19:10:00.000Z'),
        eventType: 'match',
        event: {
          id: 11348966,
          datetime: new Date('2019-04-23T19:10:00.000Z'),
          type: 'ended',
        },
      },
    ];

    expect(() => service.calculateRankings(logEntries)).toThrow(
      new BadRequestException(`There is no active round`),
    );
  });
});
