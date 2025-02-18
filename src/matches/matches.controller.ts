import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LogParserService } from '../common/services/log-parser/log-parser.service';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';
import { MatchesService } from './services/matches.service';
import { Span } from 'nestjs-otel';

@Controller('/api/matches')
export class MatchesController {
  private static readonly MAX_FILE_SIZE =
    Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

  constructor(
    private readonly logParserService: LogParserService,
    private readonly matchesService: MatchesService,
  ) {}

  @Span(`MatchesController#create`)
  @Post()
  @UseInterceptors(new FileUploadInterceptor().getInterceptor())
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MatchesController.MAX_FILE_SIZE,
          }),
        ],
      }),
    )
    matchLogsFile: Express.Multer.File,
  ) {
    const data = matchLogsFile.buffer.toString('utf-8');
    const logEntries = this.logParserService.parse(data);

    return this.matchesService.calculateRankings(logEntries).toJson();
  }
}
