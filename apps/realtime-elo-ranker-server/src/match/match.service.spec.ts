import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RankingService } from '../ranking/ranking.service';
import { PlayerController } from '../player/player.controller';
import { Player } from '../player/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        RankingService,
        EventEmitter2,
        MatchService,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Match),
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

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should return an error if player id is not valid', () => {
  //   const match1: Match = {
  //     id: 0,
  //     winner: 'player1',
  //     loser: 'player2',
  //     draw: false,
  //   };

  //   service.create(match1, (result) => {
  //     expect(result).toEqual({
  //       code: service.PLAYERS_NOT_FOUND,
  //       message: "Le gagnant indiqué n'existe pas",
  //     });
  //   });
  // });
});
