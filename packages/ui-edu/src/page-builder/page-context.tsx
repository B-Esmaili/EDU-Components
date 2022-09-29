/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormProvider } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useExistingElement } from './use-element';
import { useMemo, useRef, useState } from 'react';
import { DragOverlayView } from './components/drag-overlay-view';
import { createGlobalStyle } from 'styled-components';
import { UseFormReturn } from 'react-hook-form';
import {
  PageBuilderContextProvider,
  PageBuilderContextValue,
  PageElementId,
} from './page-builder-context';
import { builtInComponentsMeta } from './element-factory';
import { ElementClassValues } from './types';
import { PageBuilderLocalization } from './page-builder';
import { PartialDeep } from 'type-fest';
import { defaultLocalization } from './localization';
import { deepMerge } from 'grommet/utils';

const GlobalStyle = createGlobalStyle`
` as React.ComponentClass;

interface DragDropContextProps {
  children: React.ReactNode;
}

export interface PageContextProps {
  children: React.ReactNode;
  formMethods: UseFormReturn<any>;
  localization?: PartialDeep<PageBuilderLocalization>;
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

  const canDrop = (
    sourceClasses: ElementClassValues[] | null,
    targetAccepts: ElementClassValues[] | null
  ): boolean => {
    if (!targetAccepts || targetAccepts.includes('*')) {
      return true;
    }

    if (!sourceClasses) {
      return true;
    }

    return sourceClasses.some((c) => targetAccepts.includes(c));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    //@ts-ignore
    const oldParentId = e.active?.data?.current?.sortable?.containerId;
    //@ts-ignore
    const newParentId = e.over?.data?.current?.sortable?.containerId;
    const sourceClasses = e.active?.data?.current?.[
      'classes'
    ] as ElementClassValues[];

    const id = e.over?.id as string;
    const { id: oldId } = e.active;
    const indicatorRect = targetIndicatorRef.current;
    if (indicatorRect) {
      targetIndicatorRef.current = null;
      document.body.removeChild(indicatorRect);
    }

    if (!id || !e.over) {
      return;
    }

    //if target is a container
    if (id.startsWith('root')) {
      const targetAccepts = e.over?.data?.current?.[
        'accept'
      ] as ElementClassValues[];

      if (!canDrop(sourceClasses, targetAccepts)) {
        return;
      }

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
        const targetAccepts = e.over?.data?.current?.[
          'parentAccept'
        ] as ElementClassValues[];

        if (!canDrop(sourceClasses, targetAccepts)) {
          return;
        }

        const mousePosY =
          (e.activatorEvent as Record<string, any>)['pageY'] + e.delta.y;
        const mousePosX =
          (e.activatorEvent as Record<string, any>)['pageX'] + e.delta.x;
        const {
          height: targetHeight,
          width: targetWidth,
          left: targetX,
          top: targetY,
        } = e.over.rect;

        //@ts-ignore
        const targetDomElement = e.collisions?.at(0)?.data.droppableContainer
          .node.current as HTMLElement;
        const targetFraction =
          (targetDomElement.clientWidth * 100) /
          (targetDomElement.parentElement?.clientWidth ?? 0);

        const targetOffsetY = mousePosY - (targetY + window.scrollY),
          targetOffsetX = mousePosX - (targetX + window.scrollX);

        const orientY = (100 * targetOffsetY) / targetHeight,
          orientX = (100 * targetOffsetX) / targetWidth;

        const targetIndexOffset =
          (targetFraction > 90 ? orientY : orientX) > 50 ? 1 : 0;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const newParentEl = useExistingElement(newParentId);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const oldParentEl = useExistingElement(oldParentId);
        if (newParentEl && oldParentEl) {
          const dragedElement = oldParentEl.getElementById(oldId as string);
          const srcIndex = oldParentEl.getElementIndexById(oldId as string);
          const targetIndex = newParentEl.getElementIndexById(id as string);

          oldParentEl?.removeElement(srcIndex);

          const computedTargetIndex = Math.max(
            Math.min(
              targetIndex + targetIndexOffset,
              newParentEl.childElements.length
            ),
            0
          );

          if (dragedElement) {
            newParentEl?.addElement(dragedElement, computedTargetIndex);
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

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      collisionDetection={pointerWithin}
      sensors={sensors}
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
  const { children, formMethods: methods, localization } = props;

  const componentsMetadata = useMemo(() => {
    return [...builtInComponentsMeta];
  }, []);

  const compositeLocalization = useMemo(
    () =>
      localization
        ? deepMerge(defaultLocalization, localization)
        : defaultLocalization,
    [localization]
  );

  const contextValue: PageBuilderContextValue = {
    setActiveElementId: (id: PageElementId | null) => {
      methods.setValue('activeElementId', id);
    },
    activeElementId: methods.watch('activeElementId'),
    componentsMetadata,
    localization: compositeLocalization,
  };

  return (
    <PageBuilderContextProvider value={contextValue}>
      <FormProvider {...methods}>
        {methods.control && (
          <DevTool placement="bottom-left" control={methods.control} />
        )}
        <DragDropContext>{children}</DragDropContext>
      </FormProvider>
    </PageBuilderContextProvider>
  );
};

export { PageContext };
