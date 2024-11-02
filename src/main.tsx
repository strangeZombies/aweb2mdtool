import { render } from 'preact';
import { App } from './core/app';
import styles from '@/index.module.css'; // 导入 CSS Modules

function createShadowDom() {
  // 这是顶层文档
  if (window.top === window) {
    // 创建一个 div 元素作为根
    const rootDiv = document.createElement('div');
    document.documentElement.appendChild(rootDiv); // 将根元素添加到文档中
    // 启用 Shadow DOM
    const shadowDOM = rootDiv.attachShadow({ mode: 'open' });

    // 创建一个样式元素并添加 CSS Modules 的样式
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* 将 CSS Modules 的样式添加到样式元素中 */
      ${styles}
    `;
    shadowDOM.appendChild(styleElement);

    // 渲染应用到 Shadow DOM
    render(<App className={styles.app} />, shadowDOM); // 将样式类名传递给 App 组件
  }
}

// 挂载应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createShadowDom);
} else {
  createShadowDom();
}
