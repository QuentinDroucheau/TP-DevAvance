import { Controller } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('api/ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}
}
