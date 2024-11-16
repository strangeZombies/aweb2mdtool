import { Signal } from '@preact/signals';
import { safeJSONParse } from '@/utils/common';
import logger from '@/utils/logger';
import packageJson from '@/../package.json';

// 假设 AppOptions 类型如下
export interface AppOptions {
  theme?: string;
  debug?: boolean;
  showControlPanel?: boolean;
  showToggleButton?: boolean;
  language?: string;
  version?: string;
}

export const DEFAULT_APP_OPTIONS: AppOptions = {
  theme: 'emerald',
  debug: false,
  showControlPanel: true,
  showToggleButton: true,
  language: '',
  version: packageJson.version,
};
// https://daisyui.com/docs/themes/
export const THEMES = [
  //'system',
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
  public signal = new Signal(0);

  constructor() {
    this.loadAppOptions();
  }
  public get<T extends keyof AppOptions>(key: T, defaultValue?: AppOptions[T]) {
    return this.appOptions[key] ?? defaultValue;
  }
  private loadAppOptions() {
    const savedOptions = GM_getValue(GM_MAIN_VALUE, '{}'); // 使用 GM_getValue 获取存储的值
    this.appOptions = {
      ...this.appOptions,
      ...safeJSONParse(savedOptions), // 合并默认选项和保存的选项
    };
    const oldVersion = this.appOptions.version ?? '';
    const newVersion = DEFAULT_APP_OPTIONS.version ?? '';

    logger.info(`App options migrated from v${oldVersion} to v${newVersion}`);
    logger.info('App options loaded', this.appOptions);
    this.signal.value++;
  }
}
