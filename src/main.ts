import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// create winston logger instance
const instance = createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.json(),
  ),
  defaultMeta: { service: 'life-count-down' },
  transports: [
    new winston.transports.Console(),
  ]
});
let app: INestApplication;
async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
    bufferLogs: true,
  });
  // change to 8080 for fly-io
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))
  app.enableShutdownHooks();
  const config = new DocumentBuilder()
  .setTitle('LifeCountdown api')
  .setDescription('The LifeCountdown API description')
  .setVersion('1.0')
  .addTag('life-count-down')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080, () => {
    instance.log('info','life-count-down start successfully', 'app')
  });

}
bootstrap();
// setup graceful shutdown
const gracefulShutdown = (signal?: unknown) => {
  instance.log('info', 'server gracefulShutdown...', signal);
  app.close().then(()=> {
    instance.log('info', 'server successfully shutdown', signal);
    process.exit(0);
  })
  .catch((err: unknown) => instance.error('server shutdown failed', err));
  setTimeout(() => {
    instance.error('force to shutdown after 5 seconds');
    process.exit(1);
  }, 5000);
}
process.on('uncaughtException', gracefulShutdown);
process.on('unhandledRejection', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);