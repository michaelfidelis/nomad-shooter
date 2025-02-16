import { LogEntry } from '../../common/dtos/log-entry.dto';
import { Match } from '../match.entity';

export interface EventStrategy {
  handleEvent(match: Match, logEntry: LogEntry): void;
}
