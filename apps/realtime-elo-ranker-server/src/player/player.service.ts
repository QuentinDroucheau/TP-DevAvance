import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayerService {
  ID_PLAYER_NOT_VALID = 1;
  PLAYER_ALREADY_EXISTS = 2;
  ERROR_CREATING_PLAYER = 3;
  ERROR_GETTING_PLAYER = 4;
  ERROR_GETTING_PLAYERS = 5;

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly rankingService: RankingService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.findAll((players) => {
      if (players instanceof Array) {
        this.rankingService.setRanking(players);
      }
    });
  }

  create(player: Player, callback: (result: any) => void): void {
    if (!player.id || player.id === '') {
      return callback({
        code: this.ID_PLAYER_NOT_VALID,
        message: "L'identifiant du joueur n'est pas valide",
      });
    }

    this.findAll((players: Player[]) => {
      let totalRank = 0;
      players.forEach((player) => {
        totalRank += player.rank;
      });
      player.rank = Math.round(
        players.length > 0 ? totalRank / players.length : 0,
      );
    });

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
            .then((player) => {
              this.rankingService.addPlayer(player);
              this.eventEmitter.emit('RankingUpdate', {
                id: player.id,
                rank: player.rank,
              });
              callback(player);
            })
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

  findOne(id: string, callback: (result: any) => void): void {
    this.playerRepository
      .findOneBy({ id })
      .then((player) => callback(player))
      .catch(() =>
        callback({
          code: this.ERROR_GETTING_PLAYER,
          message: 'Erreur lors de la récupération du joueur',
        }),
      );
  }

  findAll(callback: (result: any) => void): void {
    this.playerRepository
      .find()
      .then((players) => callback(players))
      .catch(() =>
        callback({
          code: this.ERROR_GETTING_PLAYERS,
          message: 'Erreur lors de la récupération des joueurs',
        }),
      );
  }

  update(player: Player, callback: (result: any) => void): void {
    this.playerRepository
      .save(player)
      .then((player) => callback(player))
      .catch(() =>
        callback({
          code: this.ERROR_CREATING_PLAYER,
          message: 'Erreur lors de la mise à jour du joueur',
        }),
      );
  }
}
