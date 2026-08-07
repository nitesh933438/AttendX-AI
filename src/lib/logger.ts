// AttendX AI - Enterprise Logger Utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';

  private formatMessage(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...(context ? { context } : {})
    };
  }

  debug(message: string, context?: any) {
    if (this.isDev) {
      console.debug(`[AttendX DEBUG]`, message, context ?? '');
    }
  }

  info(message: string, context?: any) {
    console.info(`[AttendX INFO]`, message, context ?? '');
  }

  warn(message: string, context?: any) {
    console.warn(`[AttendX WARN]`, message, context ?? '');
  }

  error(message: string, error?: any, context?: any) {
    console.error(`[AttendX ERROR]`, message, error ?? '', context ?? '');
  }
}

export const logger = new Logger();
