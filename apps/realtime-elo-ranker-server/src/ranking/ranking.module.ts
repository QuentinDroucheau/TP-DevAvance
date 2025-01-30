import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { MatchModule } from 'src/match/match.module';
import { PlayerModule } from 'src/player/player.module';

@Module({
  controllers: [RankingController],
  providers: [RankingService],
  imports: [MatchModule, PlayerModule],
})
export class RankingModule {}
