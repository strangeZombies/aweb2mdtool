import { signal } from '@preact/signals';

// 定义日志行的结构，包括类型、消息和索引。
export interface LogLine {
  type: 'info' | 'warn' | 'error';
  line: string;
  index: number;
}

// 用于保存日志行的信号，初始为空数组。
export const logLinesSignal = signal<LogLine[]>([]);

// 日志方法中的额外参数类型，使用 unknown 以提高类型安全性。
type LogExtraArgs = unknown[];

/**
 * 全局日志记录器，处理消息的输出到控制台和用户界面。
 */
class Logger {
  private index = 0; // 跟踪日志条目的顺序索引。
  private buffer: LogLine[] = []; // 缓冲区，用于在更新 UI 前累积日志条目。
  private bufferTimer: number | null = null; // 刷新缓冲区的定时器。

  /**
   * 记录信息消息。
   */
  public info(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('info', line, ...args);
    this.writeBuffer({ type: 'info', line, index: this.index++ });
  }

  /**
   * 记录警告消息。
   */
  public warn(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('warn', line, ...args);
    this.writeBuffer({ type: 'warn', line, index: this.index++ });
  }

  /**
   * 记录错误消息。
   */
  public error(line: string, ...args: LogExtraArgs): void {
    this.logToConsole('error', line, ...args);
    this.writeBuffer({ type: 'error', line, index: this.index++ });
  }

  /**
   * 记录错误消息，并附上标准化的横幅以方便问题报告。
   */
  public errorWithBanner(msg: string, err?: Error, ...args: LogExtraArgs): void {
    this.error(
      `${msg} (error: ${err?.message ?? '无'})\n` +
        '  Report:\n' +
        '  https://github.com/strangezombies/AWeb2MdTool/issues',
      ...args,
    );
  }

  /**
   * 记录调试消息到控制台。
   */
  public debug(...args: LogExtraArgs): void {
    console.debug('[AWeb2MdTool]', ...args);
  }

  /**
   * 根据指定的日志级别记录消息到控制台。
   */
  private logToConsole(
    level: 'info' | 'warn' | 'error',
    line: string,
    ...args: LogExtraArgs
  ): void {
    console[level]('[AWeb2MdTool]', line, ...args);
  }

  /**
   * 将日志行添加到缓冲区，并设置定时器以刷新缓冲区。
   */
  private writeBuffer(log: LogLine): void {
    this.buffer.push(log);

    // 清除任何现有的定时器，以避免多次刷新。
    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
    }

    // 设置定时器以刷新缓冲区。
    this.bufferTimer = window.setTimeout(() => {
      this.bufferTimer = null;
      this.flushBuffer();
    }, 0);
  }

  /**
   * 刷新缓冲区中的日志行，并更新 UI。
   */
  private flushBuffer(): void {
    logLinesSignal.value = [...logLinesSignal.value, ...this.buffer];
    this.buffer = []; // 刷新后清空缓冲区。
  }
}

/**
 * 全局日志记录器单例实例，以供全局访问。
 */
const logger = new Logger();

export default logger;
