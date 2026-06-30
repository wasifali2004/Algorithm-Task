import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API and database health' })
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', database: 'connected', aiConfigured: true },
    },
  })
  async health(): Promise<{
    status: string;
    database: string;
    aiConfigured: boolean;
  }> {
    // check the database
    await this.prisma.$queryRaw`SELECT 1`;

    // check the AI key
    const aiConfigured = Boolean(
      this.configService.get<string>('GEMINI_API_KEY') ??
      this.configService.get<string>('GEMINI_aPI_KEY'),
    );

    return { status: 'ok', database: 'connected', aiConfigured };
  }
}
