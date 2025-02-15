import { Module } from '@nestjs/common';
import { LogParserService } from './services/log-parser/log-parser.service';

@Module({
  providers: [LogParserService],
  exports: [LogParserService],
})
export class CommonModule {}
