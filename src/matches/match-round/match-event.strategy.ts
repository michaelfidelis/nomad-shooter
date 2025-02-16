import { EventStrategy } from '../strategies/event.strategy';
import { LogEntry } from '../../common/dtos/log-entry.dto';
import { Match } from '../match.entity';
import { MatchRound } from './match-round.entity';
import { MatchRoundEventDTO } from '../../common/dtos/match-round-event.dto';

export class MatchEventStrategy implements EventStrategy {
  handleEvent(match: Match, logEntry: LogEntry): void {
    const datetime = logEntry.datetime;
    const matchEvent = logEntry.event as MatchRoundEventDTO;

    if (matchEvent.type === 'started') {
      match.startNewRound(new MatchRound(matchEvent.id, datetime));
    } else if (matchEvent.type === 'ended') {
      match.finishCurrentRound(matchEvent.datetime);
    }
  }
}
