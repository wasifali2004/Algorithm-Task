import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  // create the app
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // validate request data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // format all errors
  app.useGlobalFilters(new HttpExceptionFilter());

  // allow browser requests
  app.enableCors();

  // set up Swagger docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fintech API')
    .setDescription(
      'Wallet transfers, transaction intelligence, and spending insights.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // start the server
  const configuredPort = Number(process.env.PORT ?? 3010);
  const port =
    Number.isInteger(configuredPort) && configuredPort > 0
      ? configuredPort
      : 3000;
  await app.listen(port);
}

void bootstrap();
