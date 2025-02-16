import { CommonModule } from '../common/common.module';
import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './services/matches.service';

@Module({
  controllers: [MatchesController],
  imports: [CommonModule],
  providers: [MatchesService],
})
export class MatchesModule {}
