import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { Response } from 'express';
import { Res } from '@nestjs/common';

@Controller('api/player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(
    @Body() playerData: Player,
    @Res() res: Response,
  ): Promise<any> {
    return new Promise(() => {
      this.playerService.create(playerData, (result: { code: number }) => {
        let statusCode = 200;
        switch (result.code) {
          case this.playerService.ID_PLAYER_NOT_VALID:
            statusCode = HttpStatus.BAD_REQUEST;
            break;
          case this.playerService.PLAYER_ALREADY_EXISTS:
            statusCode = HttpStatus.CONFLICT;
            break;
          case this.playerService.ERROR_CREATING_PLAYER:
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            break;
        }
        res.status(statusCode).json(result);
      });
    });
  }
}
