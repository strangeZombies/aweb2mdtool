import { render } from 'preact';
import { App } from '@/core/app';
import logger from '@/utils/logger';
import packageJson from '@/../package.json';
import { Scope } from 'react-shadow-scope';
import styles from '@/index.css?inline';

async function createShadowDom() {
  if (window.top === window) {
    try {
      // 创建一个 div 元素作为根，并设置 id
      const rootDiv = document.createElement('div');
      rootDiv.id = `${packageJson.name}Div`;
      // 应用样式以防止根 div 受到外部页面样式的影响
      const globalStyles = `
        #${packageJson.name}Div {
          all: unset !important;
          width: auto;
          height: auto;
        }
      `;
      const globalStyleElement = document.createElement('style');
      globalStyleElement.textContent = globalStyles;
      document.head.appendChild(globalStyleElement);
      document.body.appendChild(rootDiv);
      // 使用 react-shadow-scope 渲染 App 组件
      render(
        <Scope stylesheet={styles} tag="my-element">
          <App />
        </Scope>,
        rootDiv,
      );
    } catch (error) {
      logger.error('Error creating Shadow DOM:', error);
    }
  }
}

// 挂载应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createShadowDom);
} else {
  createShadowDom();
}
