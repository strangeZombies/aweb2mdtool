import { Extension } from '@/core/extensions';
import { Markdown2LocalPanel } from '@/modules/markdown2local/ui';
export default class Markdown2LocalModule extends Extension {
  name = 'Markdown2LocalModule';

  render() {
    return Markdown2LocalPanel;
  }
}
