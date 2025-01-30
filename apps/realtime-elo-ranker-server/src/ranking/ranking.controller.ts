import { Controller, HttpStatus } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Get } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Controller('api/ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get()
  async getRanking(): Promise<any> {
    const ranking = await this.rankingService.getRanking();
    if (ranking.length === 0) {
      throw new HttpException(
        {
          code: 0,
          message: "Le classement n'est pas disponible car aucun joueur existe",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return ranking;
  }
}
