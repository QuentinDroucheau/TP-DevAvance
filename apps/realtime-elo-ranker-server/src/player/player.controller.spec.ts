import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { RankingService } from '../ranking/ranking.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      imports: [],
      providers: [
        PlayerService,
        RankingService,
        EventEmitter2,
        {
          provide: PlayerService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a player', async () => {
    const player = {
      id: 'player1',
      rank: 0,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    controller['playerService'].create = jest.fn((playerData, callback) => {
      callback(player);
    });

    await controller.createPlayer(player, res);

    expect(res.json).toHaveBeenCalledWith(player);
  });
});
