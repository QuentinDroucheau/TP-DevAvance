import { Controller, HttpStatus } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { PlayerService } from '../player/player.service';
import { Get } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private rankingService: RankingService,
    private playerService: PlayerService,
  ) {}

  @Get()
  async getRanking(): Promise<any> {
    const players = await this.playerService.findAll();
    if (players.length === 0) {
      throw new HttpException(
        {
          code: 0,
          message: "Le classement n'est pas disponible car aucun joueur existe",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return players;
  }
}
