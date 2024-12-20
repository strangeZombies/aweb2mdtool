import { ExtensionPanel, Modal } from '@/components/common';
//e import { TableView } from '@/components/table/table-view';
//e import { useCaptureCount } from '@/core/database/hooks';
import { Extension, ExtensionType } from '@/core/extensions';
import { TranslationKey, useTranslation } from '@/i18n';
import { useToggle } from '@/utils/common';

export type CommonModuleUIProps = {
  extension: Extension;
};

/**
 * A common UI boilerplate for modules.
 */
export function CommonModuleUI({ extension }: CommonModuleUIProps) {
  const { t } = useTranslation();
  const [showModal, toggleShowModal] = useToggle();

  const title = t(extension.name.replace('Module', '') as TranslationKey);
  //e const count = useCaptureCount(extension.name);

  //e if (extension.type !== 'tweet' && extension.type !== 'user') {
  //e   throw new Error('Incorrect use of CommonModuleUI component.');
  //e }

  return (
    <ExtensionPanel
      title={title}
      description={`description`} //e ${t('Captured:')} ${count}
      //e active={!!count && count > 0}
      onClick={toggleShowModal} //e TWEET
      indicatorColor={extension.type === ExtensionType.NONE ? 'bg-primary' : 'bg-secondary'}
    >
      <Modal
        class="max-w-4xl md:max-w-screen-md sm:max-w-screen-sm min-h-[512px]"
        title={title}
        show={showModal}
        onClose={toggleShowModal}
      >
        {/*<TableView title={title} extension={extension} />*/}
      </Modal>
    </ExtensionPanel>
  );
}
