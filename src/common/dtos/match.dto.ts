import { MatchRoundEventDTO } from './match-round-event.dto';

export class MatchDTO {
  public startedAt: Date;
  public finishedAt: Date;
  public players: Set<string>;
  public rounds: MatchRoundEventDTO[];
}
