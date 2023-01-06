import { ConsoleLogger } from '@nestjs/common';
import Winston, { format, transports, createLogger } from 'winston';
import * as moment from 'moment-timezone';
import * as secrets from '../../config/environment';

export class LoggerWinston extends ConsoleLogger {
  logger: Winston.Logger;

  private environment = secrets.ENVIRONMENT;
  private timezone = 'America/Santiago';
  private format = 'YYYY-MM-DD HH:mm:ss';

  constructor() {
    super();
    const transport = new transports.Console();
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.json(),
        // format.prettyPrint()
      ),
      transports: [transport],
    });
  }
  now() {
    return moment().tz(this.timezone);
  }

  log(message: any, ctx: string): void {
    const now = this.now();
    this.logger.info({
      message,
      humanTime: now.format(this.format),
      timeMillis: now.valueOf(),
      loggerName: ctx,
      environment: this.environment,
    });
  }

  debug(message: any, context?: string) {
    const now = this.now();
    this.logger.debug({
      message,
      humanTime: now.format(this.format),
      timeMillis: now.valueOf(),
      loggerName: context,
      environment: this.environment,
    });
  }

  error(message: any, trace?: string, ctx?: string): void {
    const now = this.now();
    this.logger.error({
      message,
      humanTime: now.format(this.format),
      timeMillis: now.valueOf(),
      trace,
      loggerName: ctx,
      environment: this.environment,
    });
  }

  writeLog(level: string, body: any): void {
    this.logger.log(level, body);
  }
}
