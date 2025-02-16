export class MatchRound {
  #id: number;
  #playersFlags: Record<string, number> = {};
  #startedAt: Date;
  #finishedAt: Date;

  constructor(id: number, startedAt: Date) {
    this.#id = id;
    this.#startedAt = startedAt;
  }

  getId(): number {
    return this.#id;
  }

  getStartedAt(): Date {
    return this.#startedAt;
  }

  getFinishedAt(): Date {
    return this.#finishedAt;
  }

  incrementPlayerFlag(playerName: string) {
    this.#playersFlags[playerName] = (this.#playersFlags[playerName] || 0) + 1;
  }

  finish(finishedAt: Date) {
    this.#finishedAt = finishedAt;
  }

  toJson() {
    return {
      id: this.#id,
      playersFlags: this.#playersFlags,
      startedAt: this.#startedAt,
      finishedAt: this.#finishedAt,
    };
  }
}
