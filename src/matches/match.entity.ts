import { Player } from './players/player.entity';
import { MatchRound } from './match-round/match-round.entity';

export type Players = Record<string, Player>;

export class Match {
  readonly MAX_PLAYERS = 20;

  #id: string;
  #players: Players = {};
  #startedAt: Date;
  #finishedAt: Date;
  #isValid: boolean = true;
  #matchRounds: MatchRound[] = [];
  #mvp: Player;

  constructor(id: string, startedAt: Date) {
    this.#id = id;
    this.#startedAt = startedAt;
  }

  getId(): string {
    return this.#id;
  }

  getPlayers(): Players {
    return this.#players;
  }

  getStartedAt(): Date {
    return this.#startedAt;
  }

  getFinishedAt(): Date {
    return this.#finishedAt;
  }

  addPlayer(playerName: string): Player {
    if (!this.#players[playerName]) {
      this.#players[playerName] = new Player(playerName);
    }

    this.updateIsValid();

    return this.#players[playerName];
  }

  getPlayer(playerName: string): Player {
    return this.#players[playerName];
  }

  startNewRound(matchRound: MatchRound) {
    this.#matchRounds.unshift(matchRound);
  }

  finishCurrentRound(finishedAt: Date) {
    this.getCurrentRound()?.finish(finishedAt);
  }

  getCurrentRound(): MatchRound {
    return this.#matchRounds[0];
  }

  isValid(): boolean {
    return this.#isValid;
  }

  finish() {
    this.#finishedAt = this.getCurrentRound()?.getFinishedAt();
    this.computeMVP();
  }

  toJson() {
    const mvp = this.#mvp && {
      player: this.#mvp.getName(),
      kills: this.#mvp.getKillCount(),
      favoriteWeapon: this.#mvp?.getFavoriteWeapon(),
    };

    return {
      id: this.#id,
      players: Object.values(this.#players).map((player) => player.toJson()),
      startedAt: this.#startedAt,
      finishedAt: this.#finishedAt,
      matchRounds: this.#matchRounds.map((matchRound) => matchRound.toJson()),
      mvp,
    };
  }

  private updateIsValid(): void {
    this.#isValid = Object.keys(this.#players).length <= this.MAX_PLAYERS;
  }

  private computeMVP(): void {
    const players = Object.values(this.getPlayers());

    this.#mvp = players.reduce(
      (selected: Player, player: Player) =>
        selected.getKillCount() > player.getKillCount() ? selected : player,
      players[0],
    );

    this.#mvp?.addAchievement('MVP');
  }
}
