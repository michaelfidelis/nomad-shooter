import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { LogParserService } from '../common/services/log-parser/log-parser.service';
import { MatchesService } from './services/matches.service';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [LogParserService, MatchesService],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
