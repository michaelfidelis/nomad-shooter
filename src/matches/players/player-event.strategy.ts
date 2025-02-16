import { EventStrategy } from '../strategies/event.strategy';
import { LogEntry } from '../../common/dtos/log-entry.dto';
import { Match } from '../match.entity';
import { Player } from './player.entity';
import { PlayerEventDTO } from '../../common/dtos/player-event.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

const WORLD = '<WORLD>';

@Injectable()
export class PlayerEventStrategy implements EventStrategy {
  handleEvent(match: Match, logEntry: LogEntry): void {
    const { datetime, event } = logEntry;
    const playerEvent: PlayerEventDTO = event as PlayerEventDTO;

    const killer: Player = match.addPlayer(playerEvent.killer);
    const victim: Player = match.addPlayer(playerEvent.victim);

    if (!match.isValid()) {
      throw new BadRequestException('The maximum number of players is 20');
    }

    victim.wasKilledBy(killer.getName(), datetime);

    if (killer.getName() !== WORLD) {
      killer.killed(victim.getName(), datetime, playerEvent.weapon);
      match.getCurrentRound().incrementPlayerFlag(killer.getName());
    }
  }
}
