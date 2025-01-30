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

  create(player: Player): Promise<Player> {
    return this.playerRepository.save(player);
  }

  findOne(id: string): Promise<Player | null> {
    return this.playerRepository.findOneBy({ id });
  }

  findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }
}
