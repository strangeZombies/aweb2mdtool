import dayjs from 'dayjs';
import { useSignal } from '@preact/signals';
import logger from './logger';

/**
 * 安全的 JSON 解析,带有错误处理。
 */
export function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    logger.error((e as Error).message);
    return null;
  }
}

/**
 * 使用信号(signal)来模拟 React 的 `useState` 钩子。
 */
export function useSignalState<T>(value: T) {
  const signal = useSignal(value);

  const updateSignal = (newValue: T) => {
    signal.value = newValue;
  };

  return [signal.value, updateSignal, signal] as const;
}

/**
 * 一个表示布尔值的信号。
 */
export function useToggle(defaultValue = false) {
  const signal = useSignal(defaultValue);

  const toggle = () => {
    signal.value = !signal.value;
  };

  return [signal.value, toggle, signal] as const;
}

/**
 * 合并 CSS 类名。
 * 这里避免使用 `tailwind-merge`,因为它会增加 bundle 的大小。
 *
 * @example
 * cx('foo', 'bar', false && 'baz') // => 'foo bar'
 */
export function cx(...classNames: (string | boolean | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEqual(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function xssFilter(str: string) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 将 t.co 的 URL 替换为真实的 HTML 链接。
 *
 * @example
 * ```jsx
 * // 输入:
 * strEntitiesToHtml('Verification: https://t.co/hHSWmpjfbA NASA Hubble Space Telescope', [
 *   {
 *     "display_url": "nasa.gov/socialmedia",
 *     "expanded_url": "http://nasa.gov/socialmedia",
 *     "url": "https://t.co/hHSWmpjfbA",
 *     "indices": [140, 163]
 *   }
 * ]);
 *
 * // 输出:
 * <p>Verification: <a href="http://nasa.gov/socialmedia">nasa.gov/socialmedia</a> NASA Hubble Space Telescope</p>
 * ```
 */

export interface EntityURL {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: [number, number];
}

export function strEntitiesToHTML(str: string, urls?: EntityURL[]) {
  let temp = str;

  if (!urls?.length) {
    return temp;
  }

  for (const { url, display_url, expanded_url } of urls) {
    temp = temp.replaceAll(
      url,
      `<a class="link" target="_blank" href="${xssFilter(expanded_url ?? url)}">${xssFilter(
        display_url ?? url,
      )}</a>`,
    );
  }

  return temp;
}

export function parseTwitterDateTime(str: string) {
  const trimmed = str.replace(/^\w+ (.*)$/, '$1');
  return dayjs(trimmed, 'MMM DD HH:mm:ss ZZ YYYY', 'en');
}

export function formatDateTime(date: string | number | dayjs.Dayjs, format?: string) {
  if (typeof date === 'number' || typeof date === 'string') {
    date = dayjs(date);
  }

  // 以本地时区显示。
  return date.format(format);
}

export function formatTwitterBirthdate(arg?: { day: number; month: number; year?: number }) {
  if (!arg) {
    return null;
  }

  const { day, month, year } = arg;
  const date = dayjs()
    .set('year', year ?? 0)
    .set('month', month - 1)
    .set('date', day);

  return year ? date.format('MMM DD, YYYY') : date.format('MMM DD');
}

export function formatVideoDuration(durationInMs?: number): string {
  if (typeof durationInMs !== 'number' || Number.isNaN(durationInMs)) {
    return 'N/A';
  }

  const durationInSeconds = Math.floor(durationInMs / 1000);
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
