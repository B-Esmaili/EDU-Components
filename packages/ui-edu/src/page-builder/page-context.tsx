/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useExistingElement } from './use-element';

interface DragDropContextProps {
  children: React.ReactNode;
}

export interface PageContextProps {
  children: React.ReactNode;
}

const DragDropContext: React.FC<DragDropContextProps> = (props) => {
  const { children } = props;

  const handleDragEnd = (e : DragEndEvent) => {
    //@ts-ignore
    const oldParentId = e.active?.data?.current?.sortable?.containerId;
    //@ts-ignore
    const newParentId = e.over?.data?.current?.sortable?.containerId;

    const id = e.over?.id as string;
    const {id : oldId} = e.active;

    if (!id){
      return;
    }  

    if (oldParentId === newParentId){
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const parentEl = useExistingElement(newParentId);
      if (parentEl){
        const srcIndex = parentEl.getElementIndexById(oldId as string);
        const targetInex = parentEl.getElementIndexById(id);
        parentEl.moveElement(srcIndex,targetInex);
      }
    }

    //alert();
  };

  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>;
};

const PageContext: React.FC<PageContextProps> = (props) => {
  const { children } = props;
  const methods = useForm();

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
