import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { LogParserService } from '../common/services/log-parser/log-parser.service';
import { MatchesService } from './services/matches.service';
import { CommonModule } from '../common/common.module';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [LogParserService, MatchesService],
      imports: [CommonModule],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
