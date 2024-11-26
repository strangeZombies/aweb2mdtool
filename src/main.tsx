import { render } from 'preact';
import { App } from '@/core/app';
import logger from '@/utils/logger';
import packageJson from '@/../package.json';
import styles from '@/index.css?inline';
import RuntimeLogsModule from '@/modules/runtime-logs';

const ROOT_DIV_ID = `${packageJson.name}Div`;

// 全局样式字符串
const GLOBAL_STYLES = `
  #${ROOT_DIV_ID} {
    all: unset !important;
    width: auto;
    height: auto;
  }
`;

/**
 * 创建样式元素
 * @param {string} cssText - 样式文本
 * @returns {HTMLStyleElement} 样式元素
 */
function createStyleElement(cssText) {
  const styleElement = document.createElement('style');
  styleElement.textContent = cssText;
  return styleElement;
}

/**
 * 检查当前窗口是否为顶级窗口
 * @returns {boolean} 是否为顶级窗口
 */
function isTopWindow() {
  return window.top === window.self;
}

/**
 * 创建并挂载 Shadow DOM
 */
function createShadowDom() {
  if (!isTopWindow()) {
    // 如果在 iframe 中，则不执行
    return;
  }

  try {
    // 创建根 div
    const rootDiv = document.createElement('div');
    rootDiv.id = ROOT_DIV_ID;

    // 添加全局样式元素到文档头部
    document.head.appendChild(createStyleElement(GLOBAL_STYLES));

    // 将根 div 添加到文档主体
    document.body.appendChild(rootDiv);

    // 创建 Shadow DOM
    const shadowRoot = rootDiv.attachShadow({ mode: 'open' });

    // 创建并注入 Shadow DOM 样式
    shadowRoot.appendChild(createStyleElement(styles)); // 使用导入的样式

    // 渲染应用到 Shadow DOM
    render(<App />, shadowRoot);

    logger.info('Shadow DOM created and App rendered.');
  } catch (error) {
    logger.error('Error creating Shadow DOM:', error);
  }
}

// 挂载应用，根据文档的加载状态选择合适的时机执行创建操作
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createShadowDom, { once: true });
} else {
  createShadowDom();
}
