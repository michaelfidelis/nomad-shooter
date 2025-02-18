import { ApiProperty } from '@nestjs/swagger';

export class MatchRoundResponse {
  @ApiProperty({
    example: '2ae5e861-cecc-46f3-ad0e-459127f761f8',
  })
  id: number;

  @ApiProperty({
    example: {
      Roman: 2,
      Marcus: 1,
      Bryan: 1,
    },
  })
  playersFlags: Record<string, number>;

  @ApiProperty({ example: '2021-07-01T00:00:00.000Z' })
  startedAt: Date;

  @ApiProperty({ example: '2021-07-01T01:00:00.000Z' })
  finishedAt: Date;
}
