import { JSX } from 'preact';
import { cx } from '@/utils/common';
import { ErrorBoundary } from './error-boundary';

type CheckboxLabelProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  icon?: JSX.Element;
  label: string;
  disabled?: boolean;
};

/**
 * A common checkbox label component with an icon and label text.
 */
export const CheckboxLabel = ({
  id,
  checked,
  onChange,
  icon,
  label,
  disabled: disable = false,
}: CheckboxLabelProps) => (
  <label
    htmlFor={id}
    className="cursor-pointer label join-item flex items-center transition-all duration-300 hover:bg-gray-200 rounded"
  >
    <input
      id={id}
      type="checkbox"
      className="hidden"
      checked={checked}
      disabled={disable}
      onChange={onChange}
    />
    <span className={cx('label-text flex items-center badge', checked ? 'badge-primary' : '')}>
      {icon}
      <span className="ml-1">{label}</span>
    </span>
  </label>
);

// #region ExtensionPanel
type ExtensionPanelProps = {
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
  children?: JSX.Element | JSX.Element[];
  indicatorColor?: string;
  titleIcon: JSX.Element | JSX.Element[];
};

/**
 * Common template for an extension panel.
 */
export function ExtensionPanel({
  title,
  titleIcon,
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
          {!active && (
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
          {titleIcon}
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

export function VaadinDownload(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path fill="currentColor" d="M16 10h-5.5L8 12.5L5.5 10H0v6h16zM4 14H2v-2h2z" />
      <path fill="currentColor" d="M10 6V0H6v6H3l5 5l5-5z" />
    </svg>
  );
}

export function PajamasDisk(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M3 2.5h10a.5.5 0 0 1 .5.5v5.063A2 2 0 0 0 13 8H3q-.26 0-.5.063V3a.5.5 0 0 1 .5-.5M2.5 10v3a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5M1 10V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm11 1.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-4 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2"
        clip-rule="evenodd"
      />
    </svg>
  );
}

export function SimpleIconsObsidian(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M19.355 18.538a68.967 68.959 0 0 0 1.858-2.954a.81.81 0 0 0-.062-.9c-.516-.685-1.504-2.075-2.042-3.362c-.553-1.321-.636-3.375-.64-4.377a1.7 1.7 0 0 0-.358-1.05l-3.198-4.064a4 4 0 0 1-.076.543c-.106.503-.307 1.004-.536 1.5c-.134.29-.29.6-.446.914l-.31.626c-.516 1.068-.997 2.227-1.132 3.59c-.124 1.26.046 2.73.815 4.481q.192.016.386.044a6.36 6.36 0 0 1 3.326 1.505c.916.79 1.744 1.922 2.415 3.5zM8.199 22.569q.11.019.22.02c.78.024 2.095.092 3.16.29c.87.16 2.593.64 4.01 1.055c1.083.316 2.198-.548 2.355-1.664c.114-.814.33-1.735.725-2.58l-.01.005c-.67-1.87-1.522-3.078-2.416-3.849a5.3 5.3 0 0 0-2.778-1.257c-1.54-.216-2.952.19-3.84.45c.532 2.218.368 4.829-1.425 7.531zM5.533 9.938q-.035.15-.098.29L2.82 16.059a1.6 1.6 0 0 0 .313 1.772l4.116 4.24c2.103-3.101 1.796-6.02.836-8.3c-.728-1.73-1.832-3.081-2.55-3.831zM9.32 14.01c.615-.183 1.606-.465 2.745-.534c-.683-1.725-.848-3.233-.716-4.577c.154-1.552.7-2.847 1.235-3.95q.17-.35.328-.664c.149-.297.288-.577.419-.86c.217-.47.379-.885.46-1.27c.08-.38.08-.72-.014-1.043c-.095-.325-.297-.675-.68-1.06a1.6 1.6 0 0 0-1.475.36l-4.95 4.452a1.6 1.6 0 0 0-.513.952l-.427 2.83c.672.59 2.328 2.316 3.335 4.711q.136.317.253.653"
      />
    </svg>
  );
}
