import { Injectable } from '@nestjs/common';
import { Player } from 'src/player/player.entity';
import { PlayerService } from 'src/player/player.service';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class RankingService {
  PLAYERS_NOT_FOUND = 1;

  COEFF_PONDERATION = 20;

  private ranking: Player[];

  constructor(
    @Inject(forwardRef(() => PlayerService))
    private playerService: PlayerService,
  ) {
    this.ranking = [];
  }

  setRanking(ranking: Player[]): void {
    this.ranking = ranking.sort((a, b) => b.rank - a.rank);
  }

  getRanking(callback: (result: any) => void): void {
    if (this.ranking.length < 1) {
      callback({
        code: this.PLAYERS_NOT_FOUND,
        message: "Le classement n'est pas disponible car aucun joueur n'existe",
      });
    } else {
      callback(this.ranking);
    }
  }

  addPlayer(player: Player): void {
    this.ranking.push(player);
    this.ranking = this.ranking.sort((a, b) => b.rank - a.rank);
  }

  updateRanking(
    winner: string,
    loser: string,
    callback: (result: any) => void,
  ): void {
    const winnerIndex = this.ranking.findIndex(
      (player) => player.id === winner,
    );
    const loserIndex = this.ranking.findIndex((player) => player.id === loser);

    const winnerPlayer = this.ranking[winnerIndex];
    const loserPlayer = this.ranking[loserIndex];

    const winnerElo = this.calculateNewRank(
      winnerPlayer.rank,
      loserPlayer.rank,
      1,
    );

    const loserElo = this.calculateNewRank(
      loserPlayer.rank,
      winnerPlayer.rank,
      0,
    );

    winnerPlayer.rank = winnerElo;
    loserPlayer.rank = loserElo;

    this.playerService.update(winnerPlayer, () => {});
    this.playerService.update(loserPlayer, () => {});

    this.ranking[winnerIndex] = winnerPlayer;
    this.ranking[loserIndex] = loserPlayer;

    callback({
      winner: winnerPlayer,
      loser: loserPlayer,
    });
  }

  calculateWinProbability(playerRank: number, opponentRank: number): number {
    return 1 / (1 + 10 ** ((opponentRank - playerRank) / 400));
  }

  calculateNewRank(
    currentRank: number,
    opponentRank: number,
    result: number,
  ): number {
    const winProbability = this.calculateWinProbability(
      currentRank,
      opponentRank,
    );
    return Math.round(
      currentRank + this.COEFF_PONDERATION * (result - winProbability),
    );
  }
}
