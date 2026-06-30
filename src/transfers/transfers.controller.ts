import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferEntity } from './entities/transfer.entity';
import { TransfersService } from './transfers.service';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Move money using a client-generated idempotency key',
  })
  @ApiOkResponse({ type: TransferEntity })
  @ApiBadRequestResponse({
    description: 'Transfer input or balance is invalid',
  })
  @ApiNotFoundResponse({ description: 'Sender or recipient was not found' })
  @ApiConflictResponse({
    description: 'Concurrent activity could not be resolved',
  })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransferDto,
  ): Promise<TransferEntity> {
    return this.transfersService.create(user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List sent and received transfers' })
  @ApiOkResponse({ type: [TransferEntity] })
  list(@CurrentUser() user: AuthenticatedUser): Promise<TransferEntity[]> {
    return this.transfersService.listForUser(user.userId);
  }
}
