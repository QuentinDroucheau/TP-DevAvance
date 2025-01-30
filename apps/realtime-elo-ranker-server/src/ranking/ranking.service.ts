import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/player/player.service';
import { Player } from 'src/player/player.entity';

@Injectable()
export class RankingService {
  private ranking: Player[];

  constructor(private playerService: PlayerService) {}

  async getRanking(): Promise<Player[]> {
    const players = await this.playerService.findAll();
    if (players.length === 0) {
      return [];
    }

    this.ranking = players.sort((a, b) => {
      return b.rank - a.rank;
    });

    return this.ranking;
  }
}
