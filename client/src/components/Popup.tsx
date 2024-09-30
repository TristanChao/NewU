import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: ReactNode;
  isOpen: boolean;
  popupAccessRef?: React.RefObject<HTMLElement> | null;
  onShadeClick: () => void;
};
export function Popup({
  children,
  isOpen,
  popupAccessRef,
  onShadeClick,
}: Props) {
  if (!isOpen) return null;

  const buttonRectangle = popupAccessRef?.current?.getBoundingClientRect();
  const { innerWidth } = window;

  const top = buttonRectangle ? buttonRectangle.bottom : '50%';
  const right = buttonRectangle ? innerWidth - buttonRectangle.right : '50%';

  return createPortal(
    <>
      <div
        className="fixed top-0 w-[100vw] h-[100vh] pointer-events-all"
        onClick={onShadeClick}></div>
      <div
        className="absolute bg-white p-2 border border-black rounded"
        style={{ top, right }}>
        {children}
      </div>
    </>,
    document.body
  );
}
