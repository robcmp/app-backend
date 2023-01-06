import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerWinston } from './services/logger/logger.service';
import * as secrets from './config/enviroment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new LoggerWinston() });

  const logger = new Logger();

  logger.log("Realizando validaciones de secretos ...");

  if(!await secrets.validate()){
    logger.error("Error en la validacion de secretos, no es posible levantar servicio");
    app.close();
    return;
  }
  logger.log("Validaciones de secretos realizadas exitosamente");
  
  await app.listen(secrets.APP_PORT);
  logger.log(`Servidor escuchando sobre el puerto  [${secrets.APP_PORT}]`);
}
bootstrap();
