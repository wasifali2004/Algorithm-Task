import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { CategorizationService } from './categorization.service';
import { GeminiService } from './gemini.service';

@Module({
  providers: [GeminiService, CategorizationService, AiService],
  exports: [CategorizationService, AiService],
})
export class AiModule {}
