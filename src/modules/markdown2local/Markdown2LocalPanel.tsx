import { Fragment, JSX } from 'preact';
import { useSignal, Signal } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import {
  CheckboxLabel,
  PajamasDisk,
  SimpleIconsObsidian,
  VaadinDownload,
  Modal,
} from '@/components/common';
import { useTranslation } from '@/i18n';
import { options, AppOptions } from '@/core/options';
import { convertPageToMarkdown } from '@/modules/markdown2local/TurndownConverter';
import { useToggle } from '@/utils/common';
import { Settings } from '@/core/settings';
import { TFunction } from 'i18next';

// Function to generate unique IDs
const generateUniqueId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export const handleCheckboxChange = (
  signal: Signal<boolean>,
  optionKey: keyof AppOptions,
): void => {
  signal.value = !signal.value;
  options.set(optionKey, signal.value);
};

export const getFileName = (fileName: string): string => {
  // Define platform detection
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const linuxPlatforms = ['Linux', 'Linux arm', 'Linux x86_64'];
  const macPlatforms = ['MacIntel', 'MacPPC', 'Mac68K'];

  const isWindows = windowsPlatforms.includes(window.navigator.platform);
  const isLinux = linuxPlatforms.includes(window.navigator.platform);
  const isMac = macPlatforms.includes(window.navigator.platform);

  // Common regex to replace invalid file name characters
  const invalidChars = /[/\\?%*:|"<>]/g;

  // Platform-specific file name handling
  if (isWindows) {
    // On Windows, remove invalid characters including ':'
    fileName = fileName.replace(':', '').replace(invalidChars, '-');
  } else if (isLinux || isMac) {
    // On Linux/macOS, replace invalid characters with '-'
    fileName = fileName.replace(invalidChars, '-');
  }

  // Ensure the file name doesn't start with a space or a dash (common file system restrictions)
  fileName = fileName.trim().replace(/^[\s-]+/, '');

  // Return the sanitized file name
  return fileName;
};

// Helper function to build the modal error message
const buildModalMessage = (
  localChecked: boolean,
  obsidianChecked: boolean,
  t: TFunction,
): string[] => {
  const messages: string[] = [];

  // Check local download settings if localChecked is true
  if (localChecked) {
    const downloadPathUrl = options.get('downloadPathUrl');
    if (!downloadPathUrl) {
      messages.push(t('LocalDownloadSettings'));
    }
  }

  // Check Obsidian settings if obsidianChecked is true
  if (obsidianChecked) {
    const vault = options.get('vault');
    const folder = options.get('folder');
    const baseTagsOption = options.get('baseTags');
    let baseTags: string[] = [];

    if (typeof baseTagsOption === 'string') {
      baseTags = [baseTagsOption]; // Convert string to array
    } else if (Array.isArray(baseTagsOption)) {
      baseTags = baseTagsOption; // Directly use array
    }

    if (!vault || !folder || baseTags.length === 0) {
      messages.push(t('ObsidianSoftwareSettings'));
    }
  }

  // If neither is checked, prompt the user to select a download location
  if (!localChecked && !obsidianChecked) {
    messages.push(t('SelectDownloadLocation'));
  }
  return messages;
};

// Helper function to construct the Obsidian URL
const getObsidianUrl = (fileName: string, md: string): string => {
  return (
    'obsidian://new?' +
    'file=' +
    encodeURIComponent(options.get('folder') + fileName) +
    '&content=' +
    encodeURIComponent(md) +
    '&vault=' +
    options.get('vault')
  );
};

export const getMd = async (
  localChecked: Signal<boolean>,
  obsidianChecked: Signal<boolean>,
  resultChecked: Signal<boolean>,
  markdown: Signal<string>,
  toggleShowModal: () => void,
  setError: (error: string | JSX.Element) => void,
  t: TFunction,
): Promise<void> => {
  const settingsUI = (
    <Fragment>
      <Settings />
    </Fragment>
  );

  // Get the modal messages based on the checks

  const modalMessages = buildModalMessage(localChecked.value, obsidianChecked.value, t);
  // If there are any messages, show the modal with the errors
  if (modalMessages.length > 0) {
    setError(
      <Fragment>
        <pre class="flex items-center space-x-4 text-sm">
          <span>{'>'} 配置提示: </span>
          {modalMessages.map((message, index) => (
            <span key={index}>{message}</span>
          ))}
          <span>{settingsUI}</span>
        </pre>
      </Fragment>,
    );
    toggleShowModal();
    return; // Exit if there are validation errors
  }

  // If no errors, proceed with the markdown conversion
  try {
    const { title, md } = await convertPageToMarkdown([]);
    const fileName = getFileName(title);
    // If Obsidian is checked, attempt to open in Obsidian
    if (obsidianChecked.value) {
      const fileUrl = getObsidianUrl(fileName, md);
      console.log(fileUrl);
      window.location.href = fileUrl;

      // Optional: Fallback or error handling can be added for cases where the URL doesn't work
      //setTimeout(() => {
      //  setError('无法打开 Obsidian，请确保已安装并允许使用 obsidian:// 协议');
      //  toggleShowModal();
      //}, 5000); // Delay to check if navigation happens
    }
    if (localChecked.value) {
      return;
    }
    // If resultChecked is true, store the markdown and show the modal
    if (resultChecked.value) {
      markdown.value = md;
      toggleShowModal();
    }
  } catch (error) {
    console.error('Error converting page to Markdown:', error);
    setError('转换失败，请重试。');
    toggleShowModal();
  }
};

export function Markdown2LocalPanel() {
  const { t } = useTranslation();

  const localChecked = useSignal<boolean>(options.get('localChecked') ?? false);
  const obsidianChecked = useSignal<boolean>(options.get('obsidianChecked') ?? false);
  const resultChecked = useSignal<boolean>(options.get('resultChecked') ?? false);
  const [showModal, toggleShowModal] = useToggle(false);
  const [error, setError] = useState<string | JSX.Element>('');
  const markdown = useSignal<string>('');

  // Generate unique IDs for checkboxes
  const localCheckboxId = generateUniqueId('localCheckbox');
  const obsidianCheckboxId = generateUniqueId('obsidianCheckbox');
  const resultCheckboxId = generateUniqueId('resultCheckbox');

  useEffect(() => {
    const unsubscribe = options.signal.subscribe(() => {
      localChecked.value = options.get('localChecked') ?? false;
      obsidianChecked.value = options.get('obsidianChecked') ?? false;
      resultChecked.value = options.get('resultChecked') ?? false;
    });

    return () => {
      unsubscribe();
    };
  }, [localChecked, obsidianChecked, resultChecked]);

  return (
    <Fragment>
      <div class="bg-base-200">
        <div class="form-control join flex items-center space-x-2 join-horizontal text-sm">
          <span class="join-item label">{t('DownloadTo')}:</span>
          <CheckboxLabel
            id={localCheckboxId}
            checked={localChecked.value}
            onChange={() => handleCheckboxChange(localChecked, 'localChecked')}
            icon={<PajamasDisk />}
            label={t('Local')}
            disabled={true}
          />
          <CheckboxLabel
            id={obsidianCheckboxId}
            checked={obsidianChecked.value}
            onChange={() => handleCheckboxChange(obsidianChecked, 'obsidianChecked')}
            icon={<SimpleIconsObsidian />}
            label={t('Obsidian')}
          />
        </div>
        <div class="form-control join flex items-center space-x-2 join-horizontal text-sm">
          <span class="join-item label">{t('Other')}:</span>
          <CheckboxLabel
            id={resultCheckboxId}
            checked={resultChecked.value}
            onChange={() => handleCheckboxChange(resultChecked, 'resultChecked')}
            label={t('ShowResult')}
          />
        </div>
        <button
          class="btn bg-stone-50 btn-sm md:btn-md gap-2 lg:gap-3 hover:bg-primary"
          onClick={() =>
            getMd(
              localChecked,
              obsidianChecked,
              resultChecked,
              markdown,
              toggleShowModal,
              setError,
              t,
            )
          }
        >
          <VaadinDownload />
        </button>

        <Modal
          class="max-w-4xl md:max-w-screen-md sm:max-w-screen-sm min-h-[512px]"
          show={showModal}
          onClose={toggleShowModal}
          children={
            <Fragment>
              <span>{typeof error === 'string' ? <p>{error}</p> : error}</span>
              {resultChecked.value ? (
                <Fragment>
                  <div class="p-4">
                    <h2 class="text-lg font-bold">{t('MarkdownResult')}</h2>
                    <pre class="whitespace-pre-wrap">{markdown.value}</pre>
                  </div>
                </Fragment>
              ) : (
                ''
              )}
            </Fragment>
          }
        ></Modal>
      </div>
    </Fragment>
  );
}
