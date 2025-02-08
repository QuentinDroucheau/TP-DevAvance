import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { PlayerModule } from '../player/player.module';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), PlayerModule, RankingModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
