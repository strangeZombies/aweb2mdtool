import { JSX } from 'preact';
import { cx } from '@/utils/common';
import { ErrorBoundary } from './error-boundary';

// #region ExtensionPanel
type ExtensionPanelProps = {
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
  children?: JSX.Element | JSX.Element[];
  indicatorColor?: string;
};
/**
 * Common template for an extension panel.
 */
export function ExtensionPanel({
  title,
  description,
  children,
  onClick,
  active,
  indicatorColor = 'bg-secondary',
}: ExtensionPanelProps) {
  return (
    <section class="module-panel">
      {/* Card contents. */}
      <div class="h-12 flex items-center justify-start">
        <div class="relative flex h-4 w-4 mr-3 shrink-0">
          {active && (
            <span
              class={cx(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                indicatorColor,
              )}
            />
          )}
          <span class={cx('relative inline-flex rounded-full h-4 w-4', indicatorColor)} />
        </div>
        <div class="flex flex-col flex-grow">
          <p class="text-base m-0 font-medium leading-none">{title}</p>
          <p class="text-sm text-base-content leading-5 text-opacity-70 m-0">{description}</p>
        </div>
        <button class="btn btn-sm p-0 w-9 h-9" onClick={onClick}>
          IconArrowUpRight
        </button>
      </div>
      {/* Modal entries. */}
      {children}
    </section>
  );
}

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
            <CloseIcon />
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

export const RMdIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <path
      fill="currentColor"
      d="M220.948 311.372c-23.308-3.654-45.655-5.496-65.906-5.807a572 572 0 0 1 60.56 18.222c-7.86 19.02-13.93 37.533-18.045 54.902c-31.751 10.726-70.074 17.612-118.847 17.9c-19.87 22.22-32.346 45.302-47.273 72.707L0 483.634c8.182-14.012 29.915-53.758 61.837-97.806C140.601 263.2 235.23 166.283 334.2 85.82c-108.024 66.405-199.123 166.084-279.59 289.2C88.454 176.191 278.217-.88 446.54 26.132c-6.081 23.479-10.869 43.006-18.188 66.58c-28.277-1.623-78.573 12.979-78.573 12.979c32.449-2.086 57.567-1.772 74.348 1.142a826 826 0 0 1-6.768 19.59c-63.148 3.202-137.272 60.608-196.41 184.949m18.9 177.233c5.86-94.34 41.437-204.092 97.095-288.26c97.78-55.207 171.434 11.86 86.29 89.047c-33.5 28.561-99.631 61.765-150.432 65.923c61.301 130.54 193.254 163.64 239.199 88.248c-65.938 18.079-146.576-11.244-202.69-73.513c44.4-7.436 81.719-20.466 116.936-40.792c156.36-96.645 39.815-266.272-95.786-145.583c-88.177 74.114-171.406 270.636-90.612 304.93"
    />
  </svg>
);

export const CloseIcon = (props: JSX.IntrinsicElements['svg']) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.5em"
    height="1.5em"
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.1.1 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.12.12 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.1.1 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926L224.297 857.629c-.04.041-.06.052-.083.059a.12.12 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.1.1 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512L166.371 224.297c-.041-.04-.052-.06-.059-.083a.12.12 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.1.1 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.12.12 0 0 1 .07 0Z"
    />
  </svg>
);

export function LsiconSettingOutline(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="none" stroke="currentColor">
        <path d="m13.258 8.354l.904.805a.91.91 0 0 1 .196 1.169l-1.09 1.862a.94.94 0 0 1-.35.341a1 1 0 0 1-.478.125a1 1 0 0 1-.306-.046l-1.157-.382q-.304.195-.632.349l-.243 1.173a.93.93 0 0 1-.339.544a.97.97 0 0 1-.618.206H6.888a.97.97 0 0 1-.618-.206a.93.93 0 0 1-.338-.544l-.244-1.173a6 6 0 0 1-.627-.35L3.9 12.61a1 1 0 0 1-.306.046a1 1 0 0 1-.477-.125a.94.94 0 0 1-.35-.34l-1.129-1.863a.91.91 0 0 1 .196-1.187L2.737 8v-.354l-.904-.805a.91.91 0 0 1-.196-1.169L2.766 3.81a.94.94 0 0 1 .35-.341a1 1 0 0 1 .477-.125a1 1 0 0 1 .306.028l1.138.4q.305-.195.632-.349l.244-1.173a.93.93 0 0 1 .338-.544a.97.97 0 0 1 .618-.206h2.238a.97.97 0 0 1 .618.206c.175.137.295.33.338.544l.244 1.173q.325.155.627.35l1.162-.382a.98.98 0 0 1 .784.078c.145.082.265.2.35.34l1.128 1.863a.91.91 0 0 1-.182 1.187l-.918.782z" />
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" />
      </g>
    </svg>
  );
}
export function TablerHelp(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 5v.01" />
        <path d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4" />
      </g>
    </svg>
  );
}
