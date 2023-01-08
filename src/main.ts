import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as secrets from './config/enviroment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();

  logger.log('Realizando validaciones de secretos ...');

  if (!(await secrets.validate())) {
    logger.error(
      'Error en la validacion de secretos, no es posible levantar servicio',
    );
    app.close();
    return;
  }
  logger.log('Validaciones de secretos realizadas exitosamente');
  app.enableCors();
  await app.listen(process.env.APP_PORT);
  logger.log(`Servidor escuchando sobre el puerto  [${process.env.APP_PORT}]`);
}
bootstrap();
