import { useRef, useState, type ReactNode } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

export const useDraggableModal = () => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) return;

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const handleMouseOver = () => setDisabled(false);
  const handleMouseOut = () => setDisabled(true);

  const DraggableModal = ({ children }: { children: ReactNode }) => (
    <Draggable
      disabled={disabled}
      bounds={bounds}
      nodeRef={draggleRef}
      onStart={onStart}
    >
      <div ref={draggleRef}>{children}</div>
    </Draggable>
  );

  return {
    DraggableModal,
    handleMouseOver,
    handleMouseOut,
  };
};
