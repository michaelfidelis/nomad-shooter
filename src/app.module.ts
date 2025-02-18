import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [MatchesModule, CommonModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
