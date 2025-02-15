import { CommonModule } from '../common/common.module';
import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';

@Module({
  controllers: [MatchesController],
  imports: [CommonModule],
})
export class MatchesModule {}
