import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CorrectCategoryDto } from './dto/correct-category.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List the signed-in user transaction history' })
  @ApiOkResponse({ type: [TransactionEntity] })
  list(@CurrentUser() user: AuthenticatedUser): Promise<TransactionEntity[]> {
    return this.transactionsService.listForUser(user.userId);
  }

  @Patch(':id/category')
  @ApiOperation({ summary: 'Correct a transaction category' })
  @ApiOkResponse({ type: TransactionEntity })
  @ApiBadRequestResponse({
    description: 'Category or transaction ID is invalid',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  correctCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) transactionId: string,
    @Body() dto: CorrectCategoryDto,
  ): Promise<TransactionEntity> {
    return this.transactionsService.correctCategory(
      user.userId,
      transactionId,
      dto,
    );
  }
}
