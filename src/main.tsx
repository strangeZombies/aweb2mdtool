import { render } from 'preact';
import { App } from './core/app';
import styles from '@/index.module.css'; // 导入 CSS Modules
import logger from './utils/logger';

// 创建 Shadow DOM 并渲染应用
function createShadowDom() {
  if (window.top === window) {
    try {
      // 创建一个 div 元素作为根，并设置 id
      const rootDiv = document.createElement('div');
      rootDiv.id = 'myRootDiv'; // 设置 id 属性
      document.documentElement.appendChild(rootDiv);
      const shadowDOM = rootDiv.attachShadow({ mode: 'open' });

      // 创建一个样式元素并添加 CSS Modules 的样式
      const styleElement = document.createElement('style');
      // 将 styles 对象中的所有样式转换为字符串
      const cssStyles = Object.values(styles).join('\n');
      styleElement.textContent = cssStyles; // 将样式字符串添加到样式元素中
      shadowDOM.appendChild(styleElement);

      render(<App className={styles.app} />, shadowDOM); // 将样式类名传递给 App 组件
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

// 清理函数（可选）
//function cleanup() {
//  const rootDiv = document.getElementById('myRootDiv'); // 根据 id 选择根元素
//  if (rootDiv) {
//    rootDiv.remove();
//  }
//}
//
// 你可以在需要时调用 cleanup() 函数
