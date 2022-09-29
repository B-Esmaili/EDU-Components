import { Accordion, AccordionPanel, Box } from 'grommet';
import { ElementCategory, ElementClass, ElementType, PageComponent, PageComponentEditor, PageElementProps } from '../types';
import useElement from '../use-element';
import Container from './fabric/container';
import { BladesVertical } from 'grommet-icons';
import { DraggableBox } from '../components';
import { FieldView, FormFieldType } from 'styled-hook-form';
import { useToolBox } from '../use-toolbox';

export interface RowModel {}
export interface RowConfig { 
   responsive : boolean;
}
export interface RowProps extends PageElementProps {}

const ROW_CLASSES = [ElementClass.Layout, ElementClass.Row];

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
    classes : ROW_CLASSES,
    categories : [ElementCategory.Layout]
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
