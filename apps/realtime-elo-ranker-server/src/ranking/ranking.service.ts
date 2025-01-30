import { Injectable } from '@nestjs/common';
import { MatchService } from '../match/match.service';

@Injectable()
export class RankingService {
  constructor(private matchService: MatchService) {}

  async getRanking(): Promise<any> {
    const matchs = this.matchService.getMatchs();
    return matchs;
  }
}
