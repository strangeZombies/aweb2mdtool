import { Signal } from '@preact/signals';
import { isEqual, safeJSONParse } from '@/utils/common';
import logger from '@/utils/logger';
import packageJson from '@/../package.json';

// 假设 AppOptions 类型如下
export interface AppOptions {
  theme: string;
  debug?: boolean;
  showControlPanel: boolean;
  showToggleButton: boolean;
  language?: string;
  version?: string;
  vault?: string;
  folder?: string;
  baseTags?: string;
  disabledExtensions?: string[];
}

// 默认应用选项
export const DEFAULT_APP_OPTIONS: AppOptions = {
  theme: 'emerald',
  debug: false,
  showControlPanel: true,
  showToggleButton: true,
  language: '',
  version: packageJson.version,
  disabledExtensions: ['UnknownModule'],
};

// 可用主题列表
export const THEMES = [
  'cupcake',
  'dark',
  'emerald',
  'cyberpunk',
  'valentine',
  'lofi',
  'dracula',
  'cmyk',
  'business',
  'winter',
] as const;

const GM_MAIN_VALUE = packageJson.name; // 这里的 key 应与 aweb2mdtool 对应的键匹配

export class AppOptionsManager {
  private appOptions: AppOptions = { ...DEFAULT_APP_OPTIONS };
  private previous: AppOptions = { ...DEFAULT_APP_OPTIONS };
  public signal = new Signal(0);

  constructor() {
    this.loadAppOptions();
  }
  // 待修改 get 方法支持批量获取选项

  public get<T extends keyof AppOptions>(
    key: T,
    defaultValue?: AppOptions[T],
  ): AppOptions[T] | undefined {
    return this.appOptions[key] ?? defaultValue;
  }

  public set<T extends keyof AppOptions>(key: T, value: AppOptions[T]): void {
    this.appOptions[key] = value;
    this.saveAppOptions();
  }

  public getValue(): string {
    return GM_getValue(GM_MAIN_VALUE, '{}');
  }

  private loadAppOptions(): void {
    const savedOptions = GM_getValue(GM_MAIN_VALUE, '{}');
    const parsedOptions = safeJSONParse(savedOptions);

    // 合并默认选项和保存的选项
    this.appOptions = { ...this.appOptions, ...parsedOptions };
    logger.info('App options loaded', this.appOptions);
    this.signal.value++;
  }

  private saveAppOptions(): void {
    const newValue = {
      ...this.appOptions,
      version: packageJson.version,
    };

    // 仅在新旧值不相等时保存
    if (!isEqual(this.previous, newValue)) {
      GM_setValue(GM_MAIN_VALUE, JSON.stringify(newValue));
      this.previous = { ...newValue };
      logger.debug('App options saved', this.appOptions);
      this.signal.value++;
    }
  }
}
