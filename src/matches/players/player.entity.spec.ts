import { Player } from './player.entity';

describe('PlayerEntity', () => {
  it('should increment timeline when is killed', () => {
    // Arrange
    const player = new Player('Roman');
    const killer = 'Marcus';
    const when = new Date();

    // Assert
    expect(player.getPlayerTimeline()).toEqual([]);

    // Act
    player.wasKilledBy(killer, when);

    // Assert
    expect(player.getPlayerTimeline()).toEqual([
      {
        type: 'death',
        player: killer,
        when,
      },
    ]);
  });

  it('should increment timeline when kills', () => {
    // Arrange
    const killer = new Player('Roman');
    const player = 'Marcus';
    const when = new Date();
    const weapon = 'AK47';

    // Assert
    expect(killer.getPlayerTimeline()).toEqual([]);

    // Act
    killer.killed(player, when, weapon);

    // Assert
    expect(killer.getPlayerTimeline()).toEqual([
      {
        type: 'kill',
        player,
        when,
      },
    ]);
  });

  it('should return the correct kill count', () => {
    // Arrange
    const killer = new Player('Roman');
    const players = ['Marcus', 'Julius'];
    const when = new Date();
    const weapon = 'AK47';

    // Assert
    expect(killer.getKillCount()).toEqual(0);

    // Act
    killer.killed(players[0], when, weapon);
    killer.killed(players[1], when, weapon);

    // Assert
    expect(killer.getKillCount()).toEqual(2);
  });

  it('should return the correct favorite weapon', () => {
    // Arrange
    const killer = new Player('Roman');
    const players = ['Marcus', 'Julius', 'Cesar', 'Augustus'];
    const when = new Date();
    const weapons = ['M16', 'AK47'];

    // Act
    killer.killed(players[0], when, weapons[0]);

    // Assert
    expect(killer.getFavoriteWeapon()).toEqual('M16');

    killer.killed(players[1], when, weapons[1]);
    killer.killed(players[2], when, weapons[1]);
    killer.killed(players[3], when, weapons[1]);

    // Assert
    expect(killer.getFavoriteWeapon()).toEqual('AK47');
  });
});
