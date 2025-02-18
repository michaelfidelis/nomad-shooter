import { ApiProperty } from '@nestjs/swagger';

export type WeaponStats = Record<string, number>;

export class PlayerResponse {
  @ApiProperty({ example: 'Roman' })
  name: string;

  @ApiProperty({
    example: {
      'AK-47': 2,
      M4A1: 1,
    },
  })
  weaponStats: WeaponStats;

  @ApiProperty()
  playerTimeline: PlayerTimelineResponse[];

  @ApiProperty({ example: ['Born to Die', 'Killing spree'] })
  achievements: string[];

  @ApiProperty({ example: 'AK47' })
  favoriteWeapon?: string | null;

  @ApiProperty({ example: 2 })
  bestStreak: number;
}

export class PlayerTimelineResponse {
  @ApiProperty({ example: 'kill' })
  type: string;

  @ApiProperty({ example: 'Roman' })
  player: string;

  @ApiProperty({ example: '2021-07-01T00:00:00.000Z' })
  when: Date;
}
