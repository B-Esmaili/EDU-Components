import { useSortable } from '@dnd-kit/sortable';
import { Accordion, AccordionPanel, Box, Button } from 'grommet';
import { ElementClass, ElementType, PageComponent, PageComponentEditor, PageElementProps } from '../types';
import useElement from '../use-element';
import Container, { ContainerContext } from './fabric/container';
import { BladesVertical, Drag } from 'grommet-icons';
import { DraggableBox, DragHandle } from '../components';
import { FieldView, FormFieldType } from 'styled-hook-form';
import { useContext } from 'react';
import { useToolBox } from '../use-toolbox';

export interface RowModel {}
export interface RowConfig { 
   responsive : boolean;
}
export interface RowProps extends PageElementProps {}

const ROW_CLASSES = [ElementClass.Layout];

const Row: PageComponent<RowModel, RowProps> = (props) => {
  const { path } = props;
  const { uid } = useElement<RowModel,RowConfig>(path);

  const {toolBoxView,setNodeRef} = useToolBox({
    id : uid,
    path,
    classes : ROW_CLASSES
  });

  return (
    <DraggableBox
      border={{ size: 'small', color: 'brand', style: 'solid' }}
      pad="small"
      ref={setNodeRef}
    >
      {toolBoxView}
      <Box>{path && <Container accept={["*"]} path={path} uid={uid} />}</Box>
    </DraggableBox>
  );
};

Row.displayName = "Row";

Row.ctor = ()=>{

  return {
    elementClass : ElementClass.Layout,
    type : ElementType.FabricElement,
    model : {},
    classes : [ElementClass.Layout]
  }
}

Row.icon = <BladesVertical/>

export const Editor: PageComponentEditor = (props) => {
  const { path } = props;
  return (
    <Box>
      <Accordion>
        <AccordionPanel header="General">
          <FieldView
            name={`${path}.editor.responsive`}
            label="Responsive"
            type={FormFieldType.Boolean}
            controlType={'switch'}
          />
        </AccordionPanel>
      </Accordion>
    </Box>
  );
};

export default Row;
