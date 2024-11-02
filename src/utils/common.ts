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

