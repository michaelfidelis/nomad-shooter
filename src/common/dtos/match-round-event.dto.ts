import { PlayerEventDTO } from './player-event.dto';

export class MatchRoundEventDTO {
  public id: number;
  public datetime: Date;
  public type: 'started' | 'ended';
  public playerEvents?: PlayerEventDTO[];

  constructor(id: number, datetime: Date, type: 'started' | 'ended') {
    this.id = id;
    this.datetime = datetime;
    this.type = type;
  }
}
