import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { LogParserService } from '../common/services/log-parser/log-parser.service';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [LogParserService],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
