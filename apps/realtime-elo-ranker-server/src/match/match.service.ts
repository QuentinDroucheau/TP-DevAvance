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

  async create(match: Match): Promise<Match> {
    return this.matchRepository.save(match);
  }

  async getMatchs(): Promise<Match[]> {
    return this.matchRepository.find();
  }
}
