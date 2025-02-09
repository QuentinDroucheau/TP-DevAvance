import { Controller } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Get } from '@nestjs/common';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { resolve } from 'path';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getRanking(@Res() res: Response): Promise<any> {
    return new Promise<void>((resolve) => {
      this.rankingService.getRanking((result: { code: number }) => {
        let statusCode = 200;
        switch (result.code) {
          case this.rankingService.PLAYERS_NOT_FOUND:
            statusCode = HttpStatus.NOT_FOUND;
            break;
        }
        res.status(statusCode).json(result);
        resolve();
      });
    });
  }

  @Get('events')
  subscribeRankingUpdate(@Res() res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const onRankingUpdate = (data: { id: string; rank: number }) => {
      res.write(
        `data: ${JSON.stringify({
          type: 'RankingUpdate',
          player: data,
        })}\n\n`,
      );
    };
    this.eventEmitter.on('RankingUpdate', onRankingUpdate);
    res.on('close', () => {
      this.eventEmitter.off('RankingUpdate', onRankingUpdate);
      res.end();
    });
  }
}
