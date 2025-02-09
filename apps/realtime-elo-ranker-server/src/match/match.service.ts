import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { PlayerService } from '../player/player.service';
import { Repository } from 'typeorm';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class MatchService {
  PLAYERS_NOT_FOUND = 0;
  ERROR_CREATING_MATCH = 1;

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly playerService: PlayerService,
    private readonly rankingService: RankingService,
  ) {}

  create(match: Match, callback: (result: any) => void): void {
    const { winner, loser, draw } = match;

    this.playerService.findOne(winner, (result: any) => {
      if (result == null) {
        console.log("Le gagnant indiqué n'existe pas");
        return callback({
          code: this.PLAYERS_NOT_FOUND,
          message: "Le gagnant indiqué n'existe pas",
        });
      }

      this.playerService.findOne(loser, (result: any) => {
        if (result == null) {
          console.log("Le perdant indiqué n'existe pas");
          return callback({
            code: this.PLAYERS_NOT_FOUND,
            message: "Le perdant indiqué n'existe pas",
          });
        }

        this.matchRepository
          .save(match)
          .then(() => {
            this.rankingService.updateRanking(
              winner,
              loser,
              draw,
              (result: any) => {
                return callback(result);
              },
            );
          })
          .catch(() => {
            console.log('Erreur lors de la création du match');
            return callback({
              code: this.ERROR_CREATING_MATCH,
              message: 'Erreur lors de la création du match',
            });
          });
      });
    });
  }
}
