import { Injectable, Scope } from '@nestjs/common';
import { MatchRoundEventDTO } from '../../dtos/match-round-event.dto';
import { PlayerEventDTO } from '../../dtos/player-event.dto';
import { LogEntry } from '../../dtos/log-entry.dto';

@Injectable()
export class LogParserService {
  private readonly MATCH_EVENT_REGEX =
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) - (?:New match|Match) (\d+) has (started|ended)/;

  private readonly PLAYER_EVENT_REGEX =
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) - (<WORLD>|\w+)\s+killed\s+(\w+)\s+(?:using|by)\s+([\w-]+)/;

  parse(data: string = ''): LogEntry[] {
    const lines = data?.split(/\r?\n/);

    if (!lines) return [];

    const logEntries: LogEntry[] = [];

    for (let line of lines) {
      if (!line.trim()) continue;

      const playerEvent = line.match(this.PLAYER_EVENT_REGEX);
      if (playerEvent) {
        logEntries.push(this.parsePlayerEvent(playerEvent));
        continue;
      }

      const matchEvent = line.match(this.MATCH_EVENT_REGEX);
      if (matchEvent) {
        logEntries.push(this.parseMatchEvent(matchEvent));
        continue;
      }
    }

    return logEntries;
  }

  private parseMatchEvent(matchEvent: RegExpMatchArray): LogEntry {
    const [_, day, month, year, hour, minute, second, matchId, matchEventType] =
      matchEvent;

    const datetime = new Date(+year, +month - 1, +day, +hour, +minute, +second);

    return {
      datetime: datetime,
      eventType: 'match',
      event: new MatchRoundEventDTO(
        +matchId,
        datetime,
        matchEventType as 'started' | 'ended',
      ),
    };
  }

  private parsePlayerEvent(playerEvent: RegExpMatchArray): LogEntry {
    const [_, day, month, year, hour, minute, second, killer, victim, weapon] =
      playerEvent;

    const datetime = new Date(+year, +month - 1, +day, +hour, +minute, +second);

    return {
      datetime: datetime,
      eventType: 'player',
      event: new PlayerEventDTO(killer, victim, weapon, datetime),
    };
  }
}
