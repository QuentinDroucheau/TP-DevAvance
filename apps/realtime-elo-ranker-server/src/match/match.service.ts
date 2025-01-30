import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  create(match: Match): Promise<Match> {
    return this.matchRepository.save(match);
  }

  getMatchs(): Promise<Match[]> {
    return this.matchRepository.find();
  }
}
