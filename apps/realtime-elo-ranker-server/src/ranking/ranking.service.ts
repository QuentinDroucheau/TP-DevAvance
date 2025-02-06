import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { Player } from 'src/player/player.entity';

@Injectable()
export class RankingService {
  private ranking: Player[];

  constructor(private playerService: PlayerService) {}
}
