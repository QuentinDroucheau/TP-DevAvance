import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { PlayerService } from '../player/player.service';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchService } from './match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Player } from '../player/player.entity';
import { Response } from 'express';

describe('MatchController', () => {
  let controller: MatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      imports: [],
      providers: [
        PlayerService,
        MatchService,
        RankingService,
        EventEmitter2,
        {
          provide: getRepositoryToken(Player),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a match', async () => {
    const match = {
      id: 0,
      winner: 'player1',
      loser: 'player2',
      draw: false,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    controller['matchService'].create = jest.fn((matchData, callback) => {
      callback(match);
    });

    await controller.createMatch(match, res);

    expect(res.json).toHaveBeenCalledWith(match);
  });
});
