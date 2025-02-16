import {
  Controller,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogParserService } from '../common/services/log-parser/log-parser.service';
import { MatchesService } from './services/matches.service';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly logParserService: LogParserService,
    private readonly matchesService: MatchesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() matchLogsFile: Express.Multer.File) {
    if (!matchLogsFile) {
      throw new UnprocessableEntityException('No file uploaded.');
    }

    const data = matchLogsFile.buffer.toString('utf-8');
    const logEntries = this.logParserService.parse(data);

    return this.matchesService.calculateRankings(logEntries).toJson();
  }
}
