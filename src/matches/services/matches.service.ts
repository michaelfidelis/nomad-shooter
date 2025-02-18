import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Span, TraceService } from 'nestjs-otel';
import { LogEntry } from '../../common/dtos/log-entry.dto';
import { MatchRoundEventDTO } from '../../common/dtos/match-round-event.dto';
import { MatchEventStrategy } from '../match-round/match-event.strategy';
import { Match } from '../match.entity';
import { PlayerEventStrategy } from '../players/player-event.strategy';
import { EventStrategy } from '../strategies/event.strategy';

@Injectable()
export class MatchesService {
  private readonly strategies: Record<string, EventStrategy> = {
    match: new MatchEventStrategy(),
    player: new PlayerEventStrategy(),
  };

  private readonly logger = new Logger(MatchesService.name);

  constructor(private readonly traceService: TraceService) {}

  @Span('MatchesService#calculateRankings')
  calculateRankings(logEntries: LogEntry[]): Match {
    this.logger.log('Calculating rankings', { logEntries: logEntries.length });
    const otelSpan = this.traceService.getSpan();
    try {
      otelSpan?.setAttribute('logEntries', logEntries.length);
      this.validate(logEntries);

      const match = new Match(randomUUID(), logEntries[0].datetime);
      for (const logEntry of logEntries) {
        const { eventType } = logEntry;

        const eventStrategy = this.strategies[eventType];
        if (eventStrategy) {
          eventStrategy.handleEvent(match, logEntry);
        }
      }
      match.finish();
      return match;
    } catch (error) {
      otelSpan?.recordException(error);

      /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
      this.logger.error(error?.message);
      throw error;
    }
  }

  private validateMatchEnds(logEntries: LogEntry[]): void {
    let currentEntryIndex = 0;
    let nextEntryIndex = 1;

    const opennings: number[] = [];

    while (nextEntryIndex < logEntries.length) {
      const currentEntry = logEntries[currentEntryIndex];
      const nextEntry = logEntries[nextEntryIndex];

      if (
        currentEntry.eventType === 'match' &&
        (<MatchRoundEventDTO>currentEntry.event).type === 'started'
      ) {
        opennings.push((<MatchRoundEventDTO>currentEntry.event).id);
      }

      if (
        nextEntry.eventType === 'match' &&
        (<MatchRoundEventDTO>nextEntry.event).type === 'ended'
      ) {
        const matchId = (<MatchRoundEventDTO>nextEntry.event).id;
        if (!opennings.includes(matchId)) {
          throw new BadRequestException(
            `The match with id ${matchId} does not have a start event`,
          );
        }

        opennings.pop();
      }

      currentEntryIndex++;
      nextEntryIndex++;
    }

    if (opennings.length > 0) {
      throw new BadRequestException(
        `There is no ending event for the following matches: ${opennings.toString()}`,
      );
    }
  }

  private validateMatchStart(logEntries: LogEntry[]): void {
    const firstEvent = logEntries.at(0);
    const isMatchStartEvent =
      firstEvent?.eventType === 'match' &&
      (<MatchRoundEventDTO>firstEvent.event).type === 'started';

    if (!isMatchStartEvent) {
      throw new BadRequestException(
        'The first event must be a match start event',
      );
    }
  }

  private validateMatchEnd(logEntries: LogEntry[]): void {
    const lastEvent = logEntries.at(-1);
    const isMatchEndEvent =
      lastEvent?.eventType === 'match' &&
      (<MatchRoundEventDTO>lastEvent.event).type === 'ended';

    if (!isMatchEndEvent) {
      throw new BadRequestException(
        'The last event must be a match ended event',
      );
    }
  }

  @Span('MatchesService#validate')
  private validate(logEntries: LogEntry[]): void | Error {
    this.validateMatchStart(logEntries);
    this.validateMatchEnd(logEntries);
    this.validateMatchEnds(logEntries);
  }
}
