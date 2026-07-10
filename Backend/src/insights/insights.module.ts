import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [AuthModule, AiModule],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
