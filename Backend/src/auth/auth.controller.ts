import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseEntity } from './entities/auth-response.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a user and wallet account' })
  @ApiCreatedResponse({ type: AuthResponseEntity })
  @ApiConflictResponse({ description: 'Email is already registered' })
  register(@Body() dto: RegisterDto): Promise<AuthResponseEntity> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and receive a JWT' })
  @ApiOkResponse({ type: AuthResponseEntity })
  @ApiUnauthorizedResponse({ description: 'Credentials are invalid' })
  login(@Body() dto: LoginDto): Promise<AuthResponseEntity> {
    return this.authService.login(dto);
  }
}
