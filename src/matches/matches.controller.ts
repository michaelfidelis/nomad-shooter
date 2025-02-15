import {
  Controller,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogParserService } from '../common/services/log-parser/log-parser.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly logParserService: LogParserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() matchLogsFile: Express.Multer.File) {
    if (!matchLogsFile) {
      throw new UnprocessableEntityException('No file uploaded.');
    }

    const data = matchLogsFile.buffer.toString('utf-8');
    const logEntries = this.logParserService.parse(data);

    return logEntries;
  }
}
