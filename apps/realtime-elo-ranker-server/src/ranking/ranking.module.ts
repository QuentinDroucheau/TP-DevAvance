import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { PlayerModule } from 'src/player/player.module';

@Module({
  controllers: [RankingController],
  providers: [RankingService],
  imports: [PlayerModule],
})
export class RankingModule {}
