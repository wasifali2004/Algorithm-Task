import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [AuthModule, AiModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
