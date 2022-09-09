/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { useExistingElement } from './use-element';
import { useState } from 'react';
import { DragOverlayView } from './components/drag-overlay-view';

interface DragDropContextProps {
  children: React.ReactNode;
}

export interface PageContextProps {
  children: React.ReactNode;
  data: any;
}

interface ElementId {
  id: string;
  parentPath: string;
}

const DragDropContext: React.FC<DragDropContextProps> = (props) => {
  const { children } = props;

  const [activeItem, setActiveItem] = useState<ElementId | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveItem({
      parentPath: event.active.data?.current?.sortable?.containerId as string,
      id: event.active.id as string,
    });
  }

  const handleDragEnd = (e: DragEndEvent) => {
    //@ts-ignore
    const oldParentId = e.active?.data?.current?.sortable?.containerId;
    //@ts-ignore
    const newParentId = e.over?.data?.current?.sortable?.containerId;

    const id = e.over?.id as string;
    const { id: oldId } = e.active;

    if (!id) {
      return;
    }

    //if target is a container
    if (id.startsWith('root.')) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const oldParentContext = useExistingElement(oldParentId);
      const srcElement = oldParentContext?.getElementById(oldId as string);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const targetContext = useExistingElement(id);
      if (srcElement) {
        targetContext?.addElement(srcElement);
        oldParentContext?.removeElement(
          oldParentContext.getElementIndexById(oldId)
        );
      }
    } else {
      if (oldParentId === newParentId) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const parentEl = useExistingElement(newParentId);
        if (parentEl) {
          const srcIndex = parentEl.getElementIndexById(oldId as string);
          const targetInex = parentEl.getElementIndexById(id);
          parentEl.moveElement(srcIndex, targetInex);
        }
      }
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    //old: e.active.data.current?.sortable.containerId,
    //new: e.over?.data.current?.sortable.containerId,
    const oldId = e.active.id;
    const newId = e.over?.id;
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      collisionDetection={pointerWithin}
    >
      <DragOverlay>
        {activeItem ? (
          <DragOverlayView
            parentPath={activeItem?.parentPath}
            itemId={activeItem?.id}
          />
        ) : null}
      </DragOverlay>
      {children}
    </DndContext>
  );
};

const PageContext: React.FC<PageContextProps> = (props) => {
  const { children, data } = props;
  const methods = useForm({
    defaultValues: data,
  });

  // useEffect(()=>{
  //   if (data.root){
  //     methods.register("root");
  //     methods.setValue("root" , data)
  //   }
  // },[data, methods]);

  return (
    <FormProvider {...methods}>
      {methods.control && (
        <DevTool placement="top-right" control={methods.control} />
      )}
      <DragDropContext>{children}</DragDropContext>
    </FormProvider>
  );
};

export { PageContext };
