import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { PlayerService } from 'src/player/player.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Controller('api/match')
export class MatchController {
  constructor(
    private matchService: MatchService,
    private playerService: PlayerService,
  ) {}

  @Post()
  async createMatch(@Body() matchData: Match): Promise<any> {
    const { winner, loser } = matchData;

    // vérication de l'existence des joueurs
    const findPlayerWinner = await this.playerService.findOne(winner);
    const findPlayerLoser = await this.playerService.findOne(loser);
    if (!findPlayerWinner || !findPlayerLoser) {
      throw new HttpException(
        {
          code: 0,
          message: "Soit le gagnant, soit le perdant indiqué n'existe pas",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.matchService.create(matchData);
    throw new HttpException(
      {
        winner: findPlayerWinner,
        loser: findPlayerLoser,
      },
      HttpStatus.OK,
    );
  }
}
