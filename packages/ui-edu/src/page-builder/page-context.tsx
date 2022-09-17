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
import { useRef, useState } from 'react';
import { DragOverlayView } from './components/drag-overlay-view';
import { createGlobalStyle } from 'styled-components';
import {UseFormReturn} from "react-hook-form";

const GlobalStyle = createGlobalStyle`
` as React.ComponentClass;

interface DragDropContextProps {
  children: React.ReactNode;
}

export interface PageContextProps {
  children: React.ReactNode;
  formMethods: UseFormReturn<any>;
}

interface ElementId {
  id: string;
  parentPath: string;
}

const DragDropContext: React.FC<DragDropContextProps> = (props) => {
  const { children } = props;

  const [activeItem, setActiveItem] = useState<ElementId | null>(null);
  const targetIndicatorRef = useRef<HTMLElement | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveItem({
      //@ts-ignore
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
    const indicatorRect = targetIndicatorRef.current;
    if (indicatorRect) {
      targetIndicatorRef.current = null;
      document.body.removeChild(indicatorRect);
    }

    if (!id) {
      return;
    }

    //if target is a container
    if (id.startsWith('root')) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const oldParentContext = useExistingElement(oldParentId);
      const srcElement = oldParentContext?.getElementById(oldId as string);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const targetContext = useExistingElement(id);
      if (srcElement) {
        targetContext?.addElement(srcElement);
        oldParentContext?.removeElement(
          oldParentContext.getElementIndexById(oldId as string)
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
      } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const newParentEl = useExistingElement(newParentId);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const oldParentEl = useExistingElement(oldParentId);
        if (newParentEl && oldParentEl) {
          const dragedElement = oldParentEl.getElementById(oldId as string);
          const srcIndex = oldParentEl.getElementIndexById(oldId as string);
          const targetIndex = newParentEl.getElementIndexById(id as string);

          oldParentEl?.removeElement(srcIndex);
          if (dragedElement) {
            newParentEl?.addElement(dragedElement, targetIndex);
          }
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    //old: e.active.data.current?.sortable.containerId,
    //new: e.over?.data.current?.sortable.containerId,
    console.log(event);
    if (!event.over) {
      return;
    }
    const overReact = event.over.rect;
    let indicatorRect = targetIndicatorRef.current;
    if (!indicatorRect) {
      indicatorRect = document.createElement('div');
      document.body.appendChild(indicatorRect);
      indicatorRect.style.position = 'absolute';
      indicatorRect.style.border = 'dashed 2px red';
      indicatorRect.style.pointerEvents = 'none';
      indicatorRect.style.background = 'rgb(121 181 255 / 50%)';
      indicatorRect.classList.add('drop-indicator');
      targetIndicatorRef.current = indicatorRect;
    }

    if (overReact) {
      indicatorRect.style.left = `${overReact.left}px`;
      indicatorRect.style.top = `${overReact.top + window.scrollY}px`;
      indicatorRect.style.width = `${overReact.width}px`;
      indicatorRect.style.height = `${overReact.height}px`;
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      collisionDetection={pointerWithin}
    >      
      <GlobalStyle />
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
  const { children, formMethods : methods } = props;
 

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
