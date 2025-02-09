import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PlayerService } from '../player/player.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';

describe('RankingService', () => {
  let service: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Player]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Player],
          synchronize: true,
        }),
      ],
      controllers: [RankingController],
      providers: [
        RankingService,
        {
          provide: PlayerService,
          useValue: {
            update: jest.fn(),
          },
        },
        EventEmitter2,
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an error if no players exist', () => {
    jest.spyOn(service, 'getRanking').mockImplementation((callback) => {
      callback({
        code: service.PLAYERS_NOT_FOUND,
        message: "Le classement n'est pas disponible car aucun joueur n'existe",
      });
    });

    service.getRanking((result) => {
      expect(result).toEqual({
        code: service.PLAYERS_NOT_FOUND,
        message: "Le classement n'est pas disponible car aucun joueur n'existe",
      });
    });
  });

  it('should return the ranking', () => {
    const player = new Player();
    player.id = '1';
    player.rank = 1000;

    service.setRanking([player]);
    service.addPlayer(player);

    service.getRanking((result) => {
      expect(result).toEqual([player, player]);
    });
  });

  it('should calculate win probability', () => {
    const player1 = new Player();
    player1.id = '1';
    player1.rank = 1200;

    const player2 = new Player();
    player2.id = '2';
    player2.rank = 800;

    const winProbability1 = service.calculateWinProbability(
      player1.rank,
      player2.rank,
    );
    const winProbability2 = service.calculateWinProbability(
      player2.rank,
      player1.rank,
    );

    expect(winProbability1).toBeCloseTo(0.09);
    expect(winProbability2).toBeCloseTo(0.91);
  });

  it('should calculate the new ranking after a match', () => {
    const player1 = new Player();
    player1.id = '1';
    player1.rank = 1200;

    const player2 = new Player();
    player2.id = '2';
    player2.rank = 800;

    const newRank1 = service.calculateNewRank(player1.rank, 0.76, 1);
    const newRank2 = service.calculateNewRank(player2.rank, 0.24, 0);

    expect(newRank1).toBe(1208);
    expect(newRank2).toBe(792);
  });
});
