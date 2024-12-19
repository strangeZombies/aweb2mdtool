import { CommonModuleUI } from '@/components/module-ui';
import { Extension, ExtensionType } from '@/core/extensions';
//e import { HomeTimelineInterceptor } from './api';

export default class UnknownModule extends Extension {
  name = 'UnknownModule';

  type = ExtensionType.NONE;

  //e intercept() {
  //e   return HomeTimelineInterceptor;
  //e }

  render() {
    return CommonModuleUI;
  }
}
