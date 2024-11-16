import { JSX } from 'preact';
import { cx } from '@/utils/common';
import { ErrorBoundary } from './error-boundary';
// #region Modal
type ModalProps = {
  show?: boolean;
  onClose?: () => void;
  children?: JSX.Element | JSX.Element[];
  title?: string;
  class?: string;
};

/**
 * Common template for modals.
 */
export function Modal({ show, onClose, title, children, class: className }: ModalProps) {
  if (!show) {
    return <dialog class="modal" />;
  }

  return (
    <dialog class="modal modal-open" open>
      <div class={cx('modal-box p-3 flex flex-col', className)}>
        <header class="flex items-center h-9 mb-2">
          <div
            onClick={onClose}
            class="w-9 h-9 mr-2 cursor-pointer flex justify-center items-center transition-colors duration-200 rounded-full hover:bg-base-200"
          >
            iconx
          </div>
          <h2 class="leading-none text-xl m-0 font-semibold">{title}</h2>
        </header>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <form method="dialog" class="modal-backdrop">
        <div onClick={onClose} />
      </form>
    </dialog>
  );
}

export const RMdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-2/3 h-2/3 select-none">
    <path
      fill="currentColor"
      d="M220.948 311.372c-23.308-3.654-45.655-5.496-65.906-5.807a572 572 0 0 1 60.56 18.222c-7.86 19.02-13.93 37.533-18.045 54.902c-31.751 10.726-70.074 17.612-118.847 17.9c-19.87 22.22-32.346 45.302-47.273 72.707L0 483.634c8.182-14.012 29.915-53.758 61.837-97.806C140.601 263.2 235.23 166.283 334.2 85.82c-108.024 66.405-199.123 166.084-279.59 289.2C88.454 176.191 278.217-.88 446.54 26.132c-6.081 23.479-10.869 43.006-18.188 66.58c-28.277-1.623-78.573 12.979-78.573 12.979c32.449-2.086 57.567-1.772 74.348 1.142a826 826 0 0 1-6.768 19.59c-63.148 3.202-137.272 60.608-196.41 184.949m18.9 177.233c5.86-94.34 41.437-204.092 97.095-288.26c97.78-55.207 171.434 11.86 86.29 89.047c-33.5 28.561-99.631 61.765-150.432 65.923c61.301 130.54 193.254 163.64 239.199 88.248c-65.938 18.079-146.576-11.244-202.69-73.513c44.4-7.436 81.719-20.466 116.936-40.792c156.36-96.645 39.815-266.272-95.786-145.583c-88.177 74.114-171.406 270.636-90.612 304.93"
    />
  </svg>
);
