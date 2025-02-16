import { MatchRound } from './match-round.entity';

describe('MatchRoundEntity', () => {
  it('should increment player flag', () => {
    // Arrange
    const matchRound = new MatchRound(123, new Date());

    // Act
    matchRound.incrementPlayerFlag('Julius');
    matchRound.incrementPlayerFlag('Julius');
    matchRound.incrementPlayerFlag('Julius');
    matchRound.incrementPlayerFlag('Julius');
    matchRound.incrementPlayerFlag('Marcus');

    // Assert
    expect(matchRound.getPlayersFlags()).toEqual({
      Julius: 4,
      Marcus: 1,
    });
  });
});
