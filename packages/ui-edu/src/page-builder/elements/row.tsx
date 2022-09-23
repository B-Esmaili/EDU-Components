import { useSortable } from '@dnd-kit/sortable';
import { Accordion, AccordionPanel, Box, Button, CheckBox } from 'grommet';
import { ElementClass, ElementType, PageComponent, PageComponentEditor, PageElementProps } from '../types';
import useElement from '../use-element';
import Container from './fabric/container';
import { BladesVertical, Drag } from 'grommet-icons';
import { DraggableBox, DragHandle } from '../components';
import { FieldView, FormFieldType } from 'styled-hook-form';

export interface RowModel {}
export interface RowConfig { 
   responsive : boolean;
}
export interface RowProps extends PageElementProps {}

const Row: PageComponent<RowModel, RowProps> = (props) => {
  const { path } = props;

  const { uid, config } = useElement<RowModel,RowConfig>(path);

  const { attributes, listeners, setNodeRef } = useSortable({ id: uid });

  return (
    <DraggableBox
      border={{ size: 'small', color: 'brand', style: 'solid' }}
      pad="small"
      ref={setNodeRef}
    >
      <DragHandle width="auto">
        <Button icon={<Drag />} {...attributes} {...listeners} />
      </DragHandle>
      {config && <CheckBox checked={config.responsive}/> }
      <Box>{path && <Container path={path} uid={uid} />}</Box>
    </DraggableBox>
  );
};

Row.displayName = "Row";

Row.ctor = ()=>{

  return {
    elementClass : ElementClass.Layout,
    type : ElementType.FabricElement,
    model : {}
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
