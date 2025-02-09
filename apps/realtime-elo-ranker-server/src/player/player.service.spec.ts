import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayerController } from './player.controller';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        RankingService,
        EventEmitter2,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
      ],
      controllers: [PlayerController],
      imports: [
        TypeOrmModule.forFeature([Player]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Player],
          synchronize: true,
        }),
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an error if player id is not valid', () => {
    const player1 = {
      id: '',
      rank: 1200,
    };

    service.create(player1, (result) => {
      expect(result).toEqual({
        code: service.ID_PLAYER_NOT_VALID,
        message: "L'identifiant du joueur n'est pas valide",
      });
    });
  });
});
