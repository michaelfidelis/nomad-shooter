import { ApiProperty } from '@nestjs/swagger';
import { MatchRoundResponse } from './match-round-response.dto';
import { PlayerResponse } from './player-response.dto';

export class MatchMVPResponse {
  @ApiProperty({ example: 'Roman' })
  player: string;

  @ApiProperty({ example: 5 })
  kills: number;

  @ApiProperty({ example: 'AK47', nullable: true })
  favoriteWeapon: string | null;
}

export class MatchResponse {
  @ApiProperty({ example: 11348966 })
  id: string;

  @ApiProperty({
    example: [
      {
        name: 'Roman',
        weaponStats: { AK47: 1 },
        playerTimeline: [
          {
            type: 'kill',
            player: 'Marcus',
            when: '2021-04-23T19:26:04.000Z',
          },
        ],
        achievements: [''],
        favoriteWeapon: 'AK47',
        bestStreak: 1,
      },
    ],
  })
  players: PlayerResponse[];

  @ApiProperty({ example: '2021-07-01T00:00:00.000Z' })
  startedAt: Date;

  @ApiProperty({ example: '2021-07-01T01:00:00.000Z' })
  finishedAt: Date;

  @ApiProperty({
    example: {
      id: 11348961,
      playersFlags: {
        Roman: 2,
        Marcus: 1,
        Bryan: 1,
      },
      startedAt: '2020-04-24T19:14:22.000Z',
      finishedAt: '2020-04-24T23:19:22.000Z',
    },
    isArray: true,
    required: false,
    type: MatchRoundResponse,
  })
  matchRounds: MatchRoundResponse[];

  @ApiProperty({
    example: { player: 'Roman', kills: 5, favoriteWeapon: 'AK47' },
    required: false,
  })
  mvp: MatchMVPResponse;
}
