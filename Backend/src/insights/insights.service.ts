import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { InsightsResponseDto } from './dto/insights-response.dto';

@Injectable()
export class InsightsService {
  constructor(private readonly aiService: AiService) {}

  getForUser(userId: string): Promise<InsightsResponseDto> {
    // get the user insights
    return this.aiService.getInsights(userId);
  }
}
