export class PlayerEventDTO {
  public killer: string;
  public victim: string;
  public weapon: string;
  public datetime: Date;

  constructor(killer: string, victim: string, weapon: string, datetime: Date) {
    this.killer = killer;
    this.victim = victim;
    this.weapon = weapon;
    this.datetime = datetime;
  }
}
