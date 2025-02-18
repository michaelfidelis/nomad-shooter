export type WeaponStats = Record<string, number>;

export type PlayerTimeline = {
  type: 'kill' | 'death';
  player: string;
  when: Date;
};

export class Player {
  #name: string;
  #weaponStats: WeaponStats = {};
  #playerTimeline: PlayerTimeline[] = [];
  #achievements: string[] = [];
  #bestStreak: number;

  static WORLD: string = '<WORLD>';

  constructor(name: string) {
    this.#name = name;
  }

  getName(): string {
    return this.#name;
  }

  wasKilledBy(playerName: string, when: Date) {
    this.#playerTimeline.push({
      type: 'death',
      player: playerName,
      when,
    });
  }

  killed(playerName: string, when: Date, weapon: string) {
    this.#playerTimeline.push({
      type: 'kill',
      player: playerName,
      when,
    });

    this.#weaponStats[weapon] = (this.#weaponStats[weapon] || 0) + 1;
  }

  getWeaponStats(): WeaponStats {
    return this.#weaponStats;
  }

  getPlayerTimeline(): PlayerTimeline[] {
    return this.#playerTimeline;
  }

  getKillCount(): number {
    return this.#playerTimeline.filter((timeline) => timeline.type === 'kill')
      .length;
  }

  getFavoriteWeapon(): string | null {
    const weaponStats = this.getWeaponStats();
    const favoriteWeapon = Object.entries(weaponStats).reduce(
      (acc, [weapon, kills]) => (kills > acc.kills ? { weapon, kills } : acc),
      { weapon: null, kills: 0 },
    );

    return favoriteWeapon.weapon;
  }

  addAchievement(achievement: string) {
    this.#achievements.push(achievement);
  }

  toJson() {
    return {
      name: this.#name,
      weaponStats: this.#weaponStats,
      playerTimeline: this.#playerTimeline,
      achievements: this.#achievements,
      favoriteWeapon: this.getFavoriteWeapon(),
      bestStreak: this.#bestStreak,
    };
  }

  public computeAchievements(): void {
    this.computeStreakAchievement();
    this.computeNoDeathsAchievement();
    this.compute5KillsIn1MinuteAchievement();
    this.computeOnlyDeathsAndNoKillsAchievement();
  }

  private compute5KillsIn1MinuteAchievement(): void {
    const killTimelines = this.#playerTimeline.filter(
      (timeline) => timeline.type === 'kill',
    );

    for (let i = 0; i < killTimelines.length; i++) {
      const currentKill = killTimelines[i];
      const nextKills = killTimelines.slice(i + 1, i + 5);

      if (nextKills.length < 4) {
        break;
      }

      const is5KillsIn1Minute = nextKills.every(
        (kill) => kill.when.getTime() - currentKill.when.getTime() < 60 * 1000,
      );

      if (is5KillsIn1Minute) {
        this.addAchievement('5 kills in 1 minute');
        break;
      }
    }
  }

  private computeStreakAchievement(): void {
    const streak = this.#playerTimeline.reduce(
      (acc, timeline) => {
        if (timeline.type === 'kill') {
          acc.current++;
          acc.max = Math.max(acc.current, acc.max);
        } else {
          acc.current = 0;
        }

        return acc;
      },
      { current: 0, max: 0 },
    );

    this.#bestStreak = streak.max;
    if (streak.max >= 5) {
      this.addAchievement('Killing spree');
    }
  }

  private computeNoDeathsAchievement(): void {
    if (this.#playerTimeline.every((timeline) => timeline.type === 'kill')) {
      this.addAchievement('No deaths');
    }
  }

  private computeOnlyDeathsAndNoKillsAchievement(): void {
    if (this.#playerTimeline.every((timeline) => timeline.type === 'death')) {
      this.addAchievement('Born to die');
    }
  }
}
