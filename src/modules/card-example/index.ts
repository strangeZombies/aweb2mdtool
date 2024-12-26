import { Extension } from '@/core/extensions';
import { CardExamplePanel } from '@/modules/card-example/ui';
export default class CardExampleModule extends Extension {
  name = 'CardExampleModule';

  render() {
    return CardExamplePanel;
  }
}
