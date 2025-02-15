import { MatchRoundEventDTO } from './match-round-event.dto';
import { PlayerEventDTO } from './player-event.dto';

type LogEventType = 'player' | 'match';

export class LogEntry {
  datetime: Date;
  eventType: LogEventType;
  event: MatchRoundEventDTO | PlayerEventDTO;
}
