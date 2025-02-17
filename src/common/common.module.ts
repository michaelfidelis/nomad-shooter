import { Module } from '@nestjs/common';
import { LogParserService } from './services/log-parser/log-parser.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [LogParserService],
  exports: [LogParserService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
})
export class CommonModule {}
