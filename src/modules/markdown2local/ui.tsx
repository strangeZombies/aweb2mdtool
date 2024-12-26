import { Fragment } from 'preact';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import {
  CheckboxLabel,
  PajamasDisk,
  SimpleIconsObsidian,
  VaadinDownload,
  Modal,
} from '@/components/common';
import { useTranslation } from '@/i18n';
import { options } from '@/core/options';
import { convertPageToMarkdown } from '@/modules/markdown2local/TurndownConverter';
import { useToggle } from '@/utils/common';

export function Markdown2LocalPanel() {
  const { t } = useTranslation();

  // 使用空值合并运算符设置默认值
  const localChecked = useSignal<boolean>(options.get('localChecked') ?? false);
  const obsidianChecked = useSignal<boolean>(options.get('obsidianChecked') ?? false);
  const resultChecked = useSignal<boolean>(options.get('resultChecked') ?? false);
  const [showModal, toggleShowModal] = useToggle(false); // 在组件内定义 showModal 和 toggleShowModal
  const markdown = useSignal<string>(''); // 用于存储 Markdown 内容
  const vault = options.get('vault');
  const folder = options.get('folder');
  const baseTags = options.get('baseTags');

  const handleLocalChange = () => {
    localChecked.value = !localChecked.value; // 反转当前值
    options.set('localChecked', localChecked.value);
  };

  const handleObsidianChange = () => {
    obsidianChecked.value = !obsidianChecked.value; // 反转当前值
    options.set('obsidianChecked', obsidianChecked.value);
  };

  const handleResultChange = () => {
    resultChecked.value = !resultChecked.value;
    options.set('resultChecked', resultChecked.value);
  };

  // 获取 Markdown 内容并处理
  const getMd = async () => {
    const md = await convertPageToMarkdown();
    markdown.value = md; // 更新 markdown 内容

    if (resultChecked.value) {
      toggleShowModal(); // 显示模态框
    } else {
      console.log(md);
    }
  };

  // 如果 options 发生变化，更新状态
  useEffect(() => {
    const unsubscribe = options.signal.subscribe(() => {
      // 当选项发生变化时更新信号值
      localChecked.value = options.get('localChecked') ?? false;
      obsidianChecked.value = options.get('obsidianChecked') ?? false;
    });

    // 清理订阅
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Fragment>
      <div class="bg-base-200">
        <div class="form-control join flex items-center space-x-2 join-horizontal text-sm">
          <span class="join-item label">{t('DownloadTo')}:</span>
          <CheckboxLabel
            id="localCheckbox"
            checked={localChecked.value} // 使用 .value 获取布尔值
            onChange={handleLocalChange}
            icon={<PajamasDisk />}
            label={t('Local')}
          />
          <CheckboxLabel
            id="obsidianCheckbox"
            checked={obsidianChecked.value} // 使用 .value 获取布尔值
            onChange={handleObsidianChange}
            icon={<SimpleIconsObsidian />}
            label={t('Obsidian')}
          />
        </div>
        <div class="form-control join flex items-center space-x-2 join-horizontal text-sm">
          <span class="join-item label">{t('Other')}:</span>
          <CheckboxLabel
            id="resultCheckbox"
            checked={resultChecked.value} // 使用 .value 获取布尔值
            onChange={handleResultChange}
            label={t('ShowResult')}
          />
        </div>
        <button class="" onClick={getMd}>
          <VaadinDownload />
        </button>
        <Modal
          class="max-w-4xl md:max-w-screen-md sm:max-w-screen-sm min-h-[512px]"
          show={showModal} // 使用组件内的 showModal
          onClose={toggleShowModal}
        >
          <div class="p-4">
            <h2 class="text-lg font-bold">{t('ObsidianSoftwareSettings')}</h2>
            <pre class="whitespace-pre-wrap">
              {vault}
              {folder}
              {baseTags}
            </pre>
            <h2 class="text-lg font-bold">{t('MarkdownResult')}</h2>
            <pre class="whitespace-pre-wrap">{markdown.value}</pre> {/* 显示 Markdown 内容 */}
          </div>
        </Modal>
      </div>
    </Fragment>
  );
}
