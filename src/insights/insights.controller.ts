import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { InsightsResponseDto } from './dto/insights-response.dto';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get calculated spending insights and an AI summary',
  })
  @ApiOkResponse({ type: InsightsResponseDto })
  getInsights(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InsightsResponseDto> {
    return this.insightsService.getForUser(user.userId);
  }
}
