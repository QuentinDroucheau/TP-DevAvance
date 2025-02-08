import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { PlayerModule } from 'src/player/player.module';
import { forwardRef } from '@nestjs/common';
@Module({
  controllers: [RankingController],
  providers: [RankingService],
  imports: [forwardRef(() => PlayerModule)],
  exports: [RankingService],
})
export class RankingModule {}
