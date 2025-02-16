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
    };
  }
}
