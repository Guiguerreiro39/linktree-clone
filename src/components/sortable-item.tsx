import React, { createContext, useContext, useMemo } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Props {
  id: UniqueIdentifier;
}

interface Context {
  attributes: DraggableAttributes | null;
  listeners: DraggableSyntheticListeners;
  ref: ((node: HTMLElement | null) => void) | null;
}

const SortableItemContext = createContext<Context>({
  attributes: null,
  listeners: undefined,
  ref: null,
});

export const SortableItem = ({ children, id }: PropsWithChildren<Props>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li className="flex items-center gap-2" ref={setNodeRef} style={style}>
        {children}
        <DragHandle />
      </li>
    </SortableItemContext.Provider>
  );
};

const DragHandle = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      className="text-muted-foreground cursor-grab items-center justify-center"
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <GripVertical size={20} />
    </button>
  );
};
