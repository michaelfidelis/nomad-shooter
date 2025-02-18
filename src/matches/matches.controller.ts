import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Span } from 'nestjs-otel';
import { MatchResponse } from '../common/dtos/match-response.dto';
import { LogParserService } from '../common/services/log-parser/log-parser.service';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';
import { MatchesService } from './services/matches.service';

@ApiTags('Matches')
@Controller('/api/matches')
export class MatchesController {
  private static readonly MAX_FILE_SIZE =
    Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB

  constructor(
    private readonly logParserService: LogParserService,
    private readonly matchesService: MatchesService,
  ) {}

  @ApiProduces('application/json')
  @ApiResponse({ isArray: false, status: 201, type: MatchResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Log file to upload',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Process game matches and return a match ranking' })
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
  ): MatchResponse {
    const data = matchLogsFile.buffer.toString('utf-8');
    const logEntries = this.logParserService.parse(data);

    return this.matchesService.calculateRankings(logEntries).toJson();
  }
}
