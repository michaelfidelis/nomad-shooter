import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LogEntry } from '../../common/dtos/log-entry.dto';
import { Match } from '../match.entity';
import { MatchEventStrategy } from '../match-round/match-event.strategy';
import { PlayerEventStrategy } from '../players/player-event.strategy';
import { EventStrategy } from '../strategies/event.strategy';

@Injectable()
export class MatchesService {
  private readonly strategies: Record<string, EventStrategy> = {
    match: new MatchEventStrategy(),
    player: new PlayerEventStrategy(),
  };

  calculateRankings(logEntries: LogEntry[]): Match {
    const match = new Match(randomUUID(), logEntries[0].datetime);

    for (let logEntry of logEntries) {
      const { eventType } = logEntry;

      const eventStrategy = this.strategies[eventType];
      if (eventStrategy) {
        eventStrategy.handleEvent(match, logEntry);
      }
    }
    match.finish();

    return match;
  }
}
