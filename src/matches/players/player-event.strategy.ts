import { EventStrategy } from '../strategies/event.strategy';
import { LogEntry } from '../../common/dtos/log-entry.dto';
import { Match } from '../match.entity';
import { Player } from './player.entity';
import { PlayerEventDTO } from '../../common/dtos/player-event.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class PlayerEventStrategy implements EventStrategy {
  handleEvent(match: Match, logEntry: LogEntry): void {
    if (!match.isCurrentRoundActive()) {
      throw new BadRequestException('There is no active round');
    }

    const { datetime, event } = logEntry;
    const playerEvent: PlayerEventDTO = event as PlayerEventDTO;

    const victim: Player = match.addPlayer(playerEvent.victim);

    victim.wasKilledBy(playerEvent.killer, datetime);

    if (playerEvent.killer !== Player.WORLD) {
      const killer: Player = match.addPlayer(playerEvent.killer);
      killer.killed(victim.getName(), datetime, playerEvent.weapon);
      match.getCurrentRound().incrementPlayerFlag(killer.getName());
    }

    if (!match.isValid()) {
      throw new BadRequestException('The maximum number of players is 20');
    }
  }
}
