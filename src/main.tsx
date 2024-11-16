import { render } from 'preact';
import { App } from '@/core/app';
import logger from '@/utils/logger';
import packageJson from '@/../package.json';
import styles from '@/index.css?inline';

const ROOT_DIV_ID = `${packageJson.name}Div`;

/**
 * 创建全局样式元素
 * @returns {HTMLStyleElement} 全局样式元素
 */
function createGlobalStyles() {
  const globalStyles = `
    #${ROOT_DIV_ID} {
      all: unset !important;
      width: auto;
      height: auto;
    }
  `;
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  return styleElement;
}

/**
 * 创建并挂载 Shadow DOM
 * 只有在顶级窗口中才会执行此操作，以防止在 iframe 中重复创建
 */
function createShadowDom() {
  if (window.top !== window.self) {
    // 如果在 iframe 中，则不执行
    return;
  }

  try {
    // 创建根 div
    const rootDiv = document.createElement('div');
    rootDiv.id = ROOT_DIV_ID;

    // 添加全局样式元素到文档头部
    document.head.appendChild(createGlobalStyles());

    // 将根 div 添加到文档主体
    document.body.appendChild(rootDiv);

    // 创建 Shadow DOM
    const shadowRoot = rootDiv.attachShadow({ mode: 'open' });

    // 创建并注入 Shadow DOM 样式
    const shadowStyle = document.createElement('style');
    shadowStyle.textContent = styles; // 使用导入的样式
    shadowRoot.appendChild(shadowStyle);

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
