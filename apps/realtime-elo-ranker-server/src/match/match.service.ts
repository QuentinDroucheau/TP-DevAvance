import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { PlayerService } from 'src/player/player.service';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  PLAYERS_NOT_FOUND = 0;
  ERROR_CREATING_MATCH = 1;

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private playerService: PlayerService,
  ) {}

  create(match: Match, callback: (result: any) => void): void {
    const { winner, loser } = match;

    this.playerService.findOne(winner, (result: any) => {
      if (result == null) {
        return callback({
          code: this.PLAYERS_NOT_FOUND,
          message: "Le gagnant indiqué n'existe pas",
        });
      }

      this.playerService.findOne(loser, (result: any) => {
        if (result == null) {
          return callback({
            code: this.PLAYERS_NOT_FOUND,
            message: "Le perdant indiqué n'existe pas",
          });
        }

        this.matchRepository
          .save(match)
          .then(() => {
            return callback({
              winner,
              loser,
            });
          })
          .catch(() => {
            return callback({
              code: this.ERROR_CREATING_MATCH,
              message: 'Erreur lors de la création du match',
            });
          });
      });
    });
  }
}
