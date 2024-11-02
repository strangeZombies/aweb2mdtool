import { signal } from '@preact/signals';

export interface LogLine {
  type: 'info' | 'warn' | 'error';
  line: string;
  index: number;
}

export const logLinesSignal = signal<LogLine[]>([]);

type LogExtraArgs = unknown[]; // 使用 unknown 代替 any，以提高类型安全性

/**
 * Global logger that writes logs to both screen and console.
 */
class Logger {
  private index = 0;
  private buffer: LogLine[] = [];
  private bufferTimer: number | null = null;

  public info(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('info', line, ...args);
    this.writeBuffer({ type: 'info', line, index: this.index++ });
  }

  public warn(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('warn', line, ...args);
    this.writeBuffer({ type: 'warn', line, index: this.index++ });
  }

  public error(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('error', line, ...args);
    this.writeBuffer({ type: 'error', line, index: this.index++ });
  }

  public errorWithBanner(msg: string, err?: Error, ...args: LogExtraArgs): void {
    this.error(
      `${msg} (Message: ${err?.message ?? 'none'})\n` +
        '  This may be a problem caused by any reason.\n  Please file an issue on GitHub:\n' +
        '  https://github.com/*/*/issues',
      ...args,
    );
  }

  public debug(...args: LogExtraArgs): void {
    console.debug('[AWeb2MdTool]', ...args);
  }

  /**
   * Log to console with a specific log level.
   */
  private logToConsole(
    level: 'info' | 'warn' | 'error',
    line: string,
    ...args: LogExtraArgs
  ): void {
    console[level]('[AWeb2MdTool]', line, ...args);
  }

  /**
   * Buffer log lines to reduce the number of signal and DOM updates.
   */
  private writeBuffer(log: LogLine): void {
    this.buffer.push(log);

    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
    }

    this.bufferTimer = window.setTimeout(() => {
      this.bufferTimer = null;
      this.flushBuffer();
    }, 0);
  }

  /**
   * Flush buffered log lines and update the UI.
   */
  private flushBuffer(): void {
    logLinesSignal.value = [...logLinesSignal.value, ...this.buffer];
    this.buffer = [];
  }
}

/**
 * Global logger singleton instance.
 */
const logger = new Logger();

export default logger;
