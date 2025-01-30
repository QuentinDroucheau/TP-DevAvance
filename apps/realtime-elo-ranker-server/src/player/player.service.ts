import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }

  async findOne(id: string): Promise<Player | null> {
    return this.playerRepository.findOneBy({ id });
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }
}
