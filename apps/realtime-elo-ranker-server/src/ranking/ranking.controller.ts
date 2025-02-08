import { Controller } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Get } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Res } from '@nestjs/common';

@Controller('api/ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get()
  getRanking(@Res() res: Response): void {
    this.rankingService.getRanking((result: { code: number }) => {
      let statusCode = 200;
      switch (result.code) {
        case this.rankingService.PLAYERS_NOT_FOUND:
          statusCode = HttpStatus.NOT_FOUND;
          break;
      }
      res.status(statusCode).json(result);
    });
  }
}
