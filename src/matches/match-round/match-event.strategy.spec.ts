import { Test, TestingModule } from '@nestjs/testing';
import { LogEntry } from 'src/common/dtos/log-entry.dto';
import { MatchEventStrategy } from '../match-round/match-event.strategy';
import { Match } from '../match.entity';

describe('PlayerEventStrategy', () => {
  let matchEventStrategy: MatchEventStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchEventStrategy],
    }).compile();

    matchEventStrategy = module.get<MatchEventStrategy>(MatchEventStrategy);
  });

  it('should start a new round', () => {
    // Arrange
    const match = new Match('1', new Date());
    const matchRoundLogEntry: LogEntry = {
      datetime: new Date(2025, 1, 16, 13),
      eventType: 'match',
      event: {
        type: 'started',
        id: 1,
        datetime: new Date(2025, 1, 16, 13),
      },
    };

    // Act
    matchEventStrategy.handleEvent(match, matchRoundLogEntry);

    // Assert
    expect(match.getCurrentRound().getId()).toEqual(1);
    expect(match.getCurrentRound().getStartedAt()).toEqual(
      matchRoundLogEntry.event.datetime,
    );
  });

  it('should finish the current round', () => {
    // Arrange
    const match = new Match('1', new Date());
    const matchRoundStartLogEntry: LogEntry = {
      datetime: new Date(2025, 1, 16, 13),
      eventType: 'match',
      event: {
        type: 'started',
        id: 1,
        datetime: new Date(2025, 1, 16, 13),
      },
    };

    const matchRoundEndLogEntry: LogEntry = {
      datetime: new Date(2025, 1, 16, 14, 30),
      eventType: 'match',
      event: {
        type: 'ended',
        id: 1,
        datetime: new Date(2025, 1, 16, 14, 30),
      },
    };

    // Act
    matchEventStrategy.handleEvent(match, matchRoundStartLogEntry);

    // Assert
    expect(match.getCurrentRound().getFinishedAt()).toBeUndefined();
    expect(match.getCurrentRound().getId()).toEqual(1);
    expect(match.getCurrentRound().getStartedAt()).toEqual(
      matchRoundStartLogEntry.event.datetime,
    );

    // Act
    matchEventStrategy.handleEvent(match, matchRoundEndLogEntry);

    // Assert
    expect(match.getCurrentRound().getFinishedAt()).toEqual(
      matchRoundEndLogEntry.event.datetime,
    );
  });
});
