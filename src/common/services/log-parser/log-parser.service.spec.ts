import { Test, TestingModule } from '@nestjs/testing';
import { LogParserService } from './log-parser.service';
import { PlayerEventDTO } from 'src/common/dtos/player-event.dto';
import { MatchRoundEventDTO } from 'src/common/dtos/match-round-event.dto';

describe('LogParserService', () => {
  let service: LogParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogParserService],
    }).compile();

    service = module.get<LogParserService>(LogParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse a match start log entry', () => {
    // Arrange
    const data = '15/02/2025 16:35:00 - New match 11348965 has started';
    const datetime = new Date(2025, 1, 15, 16, 35, 0);

    // Act
    const logEntries = service.parse(data);
    const match = logEntries[0].event as MatchRoundEventDTO;

    // Assert
    expect(logEntries).toHaveLength(1);
    expect(logEntries[0].eventType).toBe('match');
    expect(match.id).toBe(11348965);
    expect(match.datetime).toEqual(datetime);
    expect(match.type).toBe('started');
  });

  it('should parse a match end log entry', () => {
    // Arrange
    const data = '15/02/2025 17:00:00 - Match 11348965 has ended';
    const datetime = new Date(2025, 1, 15, 17, 0, 0);

    // Act
    const logEntries = service.parse(data);
    const match = logEntries[0].event as MatchRoundEventDTO;

    // Assert
    expect(logEntries).toHaveLength(1);
    expect(logEntries[0].eventType).toBe('match');
    expect(match.id).toBe(11348965);
    expect(match.datetime).toEqual(datetime);
    expect(match.type).toBe('ended');
  });

  it('should parse a player event log entry', () => {
    // Arrange
    const data = '15/02/2025 16:50:00 - Roman killed Marcus using AK-47';
    const datetime = new Date(2025, 1, 15, 16, 50, 0);

    // Act
    const logEntries = service.parse(data);
    const player = logEntries[0].event as PlayerEventDTO;

    // Assert
    expect(logEntries).toHaveLength(1);
    expect(logEntries[0].eventType).toBe('player');
    expect(player.killer).toBe('Roman');
    expect(player.victim).toBe('Marcus');
    expect(player.weapon).toBe('AK-47');
    expect(player.datetime).toEqual(datetime);
  });

  it('should parse a WORLD event log entry', () => {
    // Arrange
    const data = '15/02/2025 16:55:00 - <WORLD> killed Roman by DROWN';
    const datetime = new Date(2025, 1, 15, 16, 55, 0);

    // Act
    const logEntries = service.parse(data);
    const player = logEntries[0].event as PlayerEventDTO;

    // Assert
    expect(logEntries).toHaveLength(1);
    expect(logEntries[0].eventType).toBe('player');
    expect(player.killer).toBe('<WORLD>');
    expect(player.victim).toBe('Roman');
    expect(player.weapon).toBe('DROWN');
    expect(player.datetime).toEqual(datetime);
  });

  it('should ignore empty lines', () => {
    // Arrange
    const data = '15/02/2025 16:55:00 - <WORLD> killed Roman by DROWN\n\n';

    // Act
    const logEntries = service.parse(data);

    // Assert
    expect(logEntries).toHaveLength(1);
  });

  it('should parse a mixed event log entries', () => {
    // Arrange
    const data =
      '23/04/2019 15:34:22 - New match 11348965 has started\n' +
      '23/04/2019 15:36:04 - Roman killed Nick using M16\n' +
      '23/04/2019 15:36:33 - <WORLD> killed Nick by DROWN\n' +
      '23/04/2019 15:39:22 - Match 11348965 has ended\n' +
      '\n' +
      '23/04/2021 16:14:22 - New match 11348966 has started\n' +
      '23/04/2021 16:26:04 - Roman killed Marcus using M16\n' +
      '23/04/2021 16:36:33 - <WORLD> killed Marcus by DROWN\n' +
      '23/04/2021 16:49:22 - Match 11348966 has ended\n' +
      '\n' +
      '24/04/2020 16:14:22 - New match 11348961 has started\n' +
      '24/04/2020 16:26:12 - Roman killed Marcus using M16\n' +
      '24/04/2020 16:35:56 - Marcus killed Jhon using AK47\n' +
      '24/04/2020 17:12:34 - Roman killed Bryian using M16\n' +
      '24/04/2020 18:26:14 - Bryan killed Marcus using AK47\n' +
      '24/04/2020 19:36:33 - <WORLD> killed Marcus by DROWN\n' +
      '24/04/2020 20:19:22 - Match 11348961 has ended\n';

    const playerEventsFilter = (logEntry) => logEntry.eventType === 'player';
    const matchRoundEventsFilter = (logEntry) => logEntry.eventType === 'match';

    // Act
    const logEntries = service.parse(data);

    // Assert
    expect(logEntries).toHaveLength(15);
    expect(logEntries.filter(matchRoundEventsFilter)).toHaveLength(6);
    expect(logEntries.filter(playerEventsFilter)).toHaveLength(9);
  });

  it.each`
    description               | data
    ------------------------- | -------------------
    ${'undefined'}            | ${undefined}
    ${'null'}                 | ${null}
    ${'empty string'}         | ${''}
    ${'whitespace'}           | ${' '}
    ${'newline'}              | ${'\n'}
    ${'multiple newlines'}    | ${'\n\n\n\n'}
    ${'multiple whitespaces'} | ${'    '}
  `('should process an invalid ($description) value', ({ data }) => {
    // Act
    const logEntries = service.parse(data);

    // Assert
    expect(logEntries).toHaveLength(0);
  });
});
