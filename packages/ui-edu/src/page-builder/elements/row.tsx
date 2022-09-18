import { useSortable } from '@dnd-kit/sortable';
import { Accordion, AccordionPanel, Box, Button } from 'grommet';
import { PageComponent, PageComponentEditor, PageElementProps } from '../types';
import useElement from '../use-element';
import Container from './fabric/container';
import { Drag } from 'grommet-icons';
import { DraggableBox, DragHandle } from '../components';
import { FieldView, FormFieldType } from 'styled-hook-form';

export interface RowModel {}
export interface RowProps extends PageElementProps {}

const Row: PageComponent<RowModel, RowProps> = (props) => {
  const { path } = props;

  const { uid } = useElement(path);

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
      <Box>{path && <Container path={path} uid={uid} />}</Box>
    </DraggableBox>
  );
};

export const Editor : PageComponentEditor = (props) => {
  const {path} = props;
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
