import { Fragment } from 'preact';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { options } from './options';
import { useTranslation } from '@/i18n';

export function App() {
  const { t } = useTranslation(); // 获取翻译函数
  // 控制模态框显示状态
  const showControlPanel = useSignal<boolean>(options.get('showControlPanel') ?? true);

  // 打开模态框
  const openControlPanel = () => {
    showControlPanel.value = true;
    options.set('showControlPanel', true);
  };

  // 关闭模态框
  const closeControlPanel = () => {
    showControlPanel.value = false;
    options.set('showControlPanel', false);
  };

  // 切换模态框状态
  const toggleControlPanel = () => {
    if (showControlPanel.value) {
      closeControlPanel();
    } else {
      openControlPanel();
    }
  };

  // 清理函数，关闭模态框并移除相关 DOM 元素
  const cleanup = () => {
    closeControlPanel(); // 关闭模态框
    const modalElement = document.getElementById('mo');
    if (modalElement) {
      modalElement.remove();
    }

    console.log('Modal closed and cleaned up');
  };

  useEffect(() => {
    // 确保 GM_registerMenuCommand 仅在脚本环境中有效
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(t('ToggleControlPanel'), toggleControlPanel);
    }

    // 返回一个清理函数，用于组件卸载时关闭模态框并清理
    return () => {
      cleanup();
    };
  }, [t]); // 依赖数组中添加翻译函数 t，确保翻译文本更新时重新注册命令

  return (
    <Fragment>
      {/* 控制模态框的按钮 */}
      <button
        className={`btn`}
        onClick={openControlPanel}
        aria-label={t('OpenControlPanel')} // 可访问性：为按钮添加描述
      >
        {t('OpenModal')} {/* 按钮文本翻译 */}
      </button>

      {/* 将模态框内容封装到Shadow DOM中 */}
      {showControlPanel.value && (
        <dialog
          data-theme="light"
          className={`modal`}
          id="mo"
          open
          aria-labelledby="modal-title" // 可访问性：为模态框添加标题
          aria-describedby="modal-description" // 可访问性：为模态框添加描述
        >
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 id="modal-title" className="font-bold text-lg">
              {t('ModalTitle')}
            </h3>
            {/* 标题翻译 */}
            <p id="modal-description" className="py-4">
              {t('ModalDescription')}
            </p>
            {/* 描述翻译 */}
            <div className="modal-action">
              <button
                className={`btn`}
                onClick={closeControlPanel}
                aria-label={t('Close')} // 可访问性：为关闭按钮添加描述
              >
                {t('Close')} {/* 关闭按钮翻译 */}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </Fragment>
  );
}
