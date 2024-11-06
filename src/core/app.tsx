import { Fragment } from 'preact';
import { useSignal } from '@preact/signals';
//e import { useTranslation } from '@/i18n';
//e import { cx } from '@/utils/common';
import { options } from './options';

// 定义组件的 props 接口
interface AppProps {
  className?: string; // className 属性可选，类型为 string
}

export function App({ className }: AppProps) {
  // 使用类型注解

  //const currentTheme = useSignal(options.get('theme'));
  const showControlPanel = useSignal(options.get('showControlPanel'));

  const toggleControlPanel = () => {
    showControlPanel.value = !showControlPanel.value;
    options.set('showControlPanel', showControlPanel.value);
  };
  return (
    <Fragment>
      <div
        onClick={toggleControlPanel}
        class={`group w-12 h-12 fixed top-[60%] left-[-20px] cursor-pointer bg-transparent fill-base-content ${className}`} // 使用 className
      >
        <div class="w-full h-full origin origin-[bottom_center] transition-all duration-200 group-hover:translate-x-[5px] group-hover:rotate-[20deg] opacity-50 group-hover:opacity-90">
          {/* <CatIcon /> */}
        </div>
      </div>
    </Fragment>
  );
}
