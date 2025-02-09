import { Body, Controller, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './match.entity';
import { Response } from 'express';
import { Res } from '@nestjs/common';
@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async createMatch(
    @Body() matchData: Match,
    @Res() res: Response,
  ): Promise<any> {
    return new Promise<void>((resolve) => {
      this.matchService.create(matchData, (result: { code: number }) => {
        let statusCode = 200;
        switch (result.code) {
          case this.matchService.PLAYERS_NOT_FOUND:
            statusCode = 400;
            break;
          case this.matchService.ERROR_CREATING_MATCH:
            statusCode = 500;
            break;
        }
        res.status(statusCode).json(result);
        resolve();
      });
    });
  }
}
