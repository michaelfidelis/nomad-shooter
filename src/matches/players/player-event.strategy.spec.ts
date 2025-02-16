import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LogEntry } from 'src/common/dtos/log-entry.dto';
import { MatchEventStrategy } from '../match-round/match-event.strategy';
import { Match } from '../match.entity';
import { PlayerEventStrategy } from './player-event.strategy';
import { Player } from './player.entity';

describe('PlayerEventStrategy', () => {
  let playerEventStrategy: PlayerEventStrategy;
  let matchEventStrategy: MatchEventStrategy;
  let match: Match;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerEventStrategy, MatchEventStrategy],
    }).compile();

    playerEventStrategy = module.get<PlayerEventStrategy>(PlayerEventStrategy);
    matchEventStrategy = module.get<MatchEventStrategy>(MatchEventStrategy);

    match = new Match('1', new Date());
    const matchRoundLogEntry: LogEntry = {
      datetime: new Date(2025, 1, 16),
      eventType: 'match',
      event: {
        type: 'started',
        id: 1,
        datetime: new Date(),
      },
    };

    matchEventStrategy.handleEvent(match, matchRoundLogEntry);
  });

  it('should add both players to match', () => {
    // Arrange
    const logEntry: LogEntry = {
      datetime: new Date(),
      eventType: 'player',
      event: {
        killer: 'Marcus',
        victim: 'Roman',
        weapon: 'AK47',
        datetime: new Date(),
      },
    };

    // Act
    playerEventStrategy.handleEvent(match, logEntry);

    // Assert
    const matchPlayers = match.getPlayers();
    expect(Object.keys(match.getPlayers())).toEqual(['Roman', 'Marcus']);
    expect(matchPlayers['Roman']).toBeInstanceOf(Player);
    expect(matchPlayers['Marcus']).toBeInstanceOf(Player);
  });

  it('should increment killer players round flag', () => {
    // Arrange
    const logEntry: LogEntry = {
      datetime: new Date(),
      eventType: 'player',
      event: {
        killer: 'Marcus',
        victim: 'Roman',
        weapon: 'AK47',
        datetime: new Date(),
      },
    };

    // Assert
    expect(match.getCurrentRound().getPlayersFlags()['Marcus']).toBeUndefined();

    // Act
    playerEventStrategy.handleEvent(match, logEntry);

    // Assert
    const matchPlayers = match.getPlayers();
    expect(matchPlayers['Marcus']).toBeInstanceOf(Player);
    expect(match.getCurrentRound().getPlayersFlags()['Marcus']).toEqual(1);
  });

  it('should not add WORLD player to match', () => {
    // Arrange
    const logEntry: LogEntry = {
      datetime: new Date(),
      eventType: 'player',
      event: {
        killer: '<WORLD>',
        victim: 'Augustos',
        weapon: 'FALL',
        datetime: new Date(),
      },
    };

    // Act
    playerEventStrategy.handleEvent(match, logEntry);

    // Assert
    const matchPlayers = match.getPlayers();
    expect(Object.keys(match.getPlayers())).toEqual(['Augustos']);
    expect(matchPlayers['Augustos']).toBeInstanceOf(Player);
    expect(matchPlayers['<WORLD>']).toBeUndefined();
  });

  it('should throw an error when match exceds 20 players', () => {
    // Arrange
    const logEntries: LogEntry[] = Array.from({ length: 20 }, (_, i) => ({
      datetime: new Date(),
      eventType: 'player',
      event: {
        killer: `Player_${i - 20}`,
        victim: `Player_${i}`,
        weapon: 'DesertEagle',
        datetime: new Date(),
      },
    }));

    // Act & Assert
    expect(() => {
      for (const logEntry of logEntries) {
        playerEventStrategy.handleEvent(match, logEntry);
      }
    }).toThrow(new BadRequestException('The maximum number of players is 20'));
  });
});
