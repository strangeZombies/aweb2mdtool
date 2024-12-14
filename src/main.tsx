import { render as preactRender } from 'preact';
import { App as PreactApp } from '@/core/app';
import log from '@/utils/logger';
import pkgJson from '@/../package.json';
import styles from '@/index.css?inline';

const ROOT_DIV_ID: string = `${pkgJson.name}Global`;

// 全局样式字符串
const GLOBAL_STYLES: string = `
  #${ROOT_DIV_ID} {
    all: unset !important;
    width: auto;
    height: auto;
  }
`;

/**
 * 创建样式元素
 * @param {string} cssText CSS 字符串
 * @returns {HTMLStyleElement} 样式元素
 */
function createStyleElement(cssText: string): HTMLStyleElement {
  const styleElement = document.createElement('style');
  styleElement.textContent = cssText;
  return styleElement;
}

/**
 * 检查当前窗口是否为顶级窗口
 * @returns {boolean} 是否为顶级窗口
 */
function isTopWindow(): boolean {
  return window.top === window.self;
}

/**
 * 检查根 div 是否已存在
 * @returns {boolean} 根 div 是否已存在
 */
function isRootDivExists(): boolean {
  return document.getElementById(ROOT_DIV_ID) !== null;
}

/**
 * 创建并挂载 Shadow DOM
 */
function createShadowDom(): void {
  if (!isTopWindow()) {
    // 如果在 iframe 中，则不执行
    return;
  }

  if (isRootDivExists()) {
    log.info('Root div already exists, skipping creation.');
    return;
  }

  try {
    // 创建根 div
    const rootDiv: HTMLDivElement = document.createElement('div');
    rootDiv.id = ROOT_DIV_ID;
    // 添加全局样式元素到文档头部
    document.head.appendChild(createStyleElement(GLOBAL_STYLES));
    // 将根 div 添加到文档主体
    document.body.appendChild(rootDiv);
    // 创建 Shadow DOM
    const shadowRoot: ShadowRoot = rootDiv.attachShadow({ mode: 'open' });
    // 创建并注入 Shadow DOM 样式
    const styleElement: HTMLStyleElement = createStyleElement(styles);
    shadowRoot.appendChild(styleElement);
    // 渲染应用到 Shadow DOM
    preactRender(<PreactApp />, shadowRoot);
    log.info('Shadow DOM created and App rendered.');
  } catch (error) {
    log.error('Error creating Shadow DOM:', error);
  }
}

// 挂载应用，根据文档的加载状态选择合适的时机执行创建操作
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createShadowDom, { once: true });
} else {
  createShadowDom();
}
