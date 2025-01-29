import { Controller, Post, Body } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';

@Controller('api/player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async createPlayer(@Body() playerData: Player): Promise<any> {
    const { id } = playerData;
    if (!id || id === '') {
      throw new HttpException(
        {
          code: 0,
          message: "L'identifiant du joueur n'est pas valide",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const findPlayer = await this.playerService.findOne(playerData.id);
    if (findPlayer) {
      throw new HttpException(
        {
          code: 0,
          message: 'Le joueur existe déjà',
        },
        HttpStatus.CONFLICT,
      );
    }
    return this.playerService.create(playerData);
  }
}
