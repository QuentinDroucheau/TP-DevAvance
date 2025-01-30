import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  ID_PLAYER_NOT_VALID = 1;
  PLAYER_ALREADY_EXISTS = 2;
  ERROR_CREATING_PLAYER = 3;

  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  create(player: Player, callback: (result: any) => void): void {
    if (!player.id || player.id === '') {
      return callback({
        code: this.ID_PLAYER_NOT_VALID,
        message: "L'identifiant du joueur n'est pas valide",
      });
    }

    this.playerRepository
      .findOneBy({ id: player.id })
      .then((existingPlayer) => {
        if (existingPlayer) {
          return callback({
            code: this.PLAYER_ALREADY_EXISTS,
            message: 'Le joueur existe déjà',
          });
        } else {
          this.playerRepository
            .save(player)
            .then((player) => callback(player))
            .catch(() =>
              callback({
                code: this.ERROR_CREATING_PLAYER,
                message: 'Erreur lors de la création du joueur',
              }),
            );
        }
      })
      .catch(() => {
        return callback({
          code: this.ERROR_CREATING_PLAYER,
          message: 'Erreur lors de la création du joueur',
        });
      });
  }

  async findOne(id: string): Promise<Player | null> {
    return this.playerRepository.findOneBy({ id });
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }
}
