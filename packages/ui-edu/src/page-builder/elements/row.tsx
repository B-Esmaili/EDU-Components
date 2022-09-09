import { useSortable } from '@dnd-kit/sortable';
import { Box, Button } from 'grommet';
import { PageComponent, PageElementProps } from '../types';
import useElement from '../use-element';
import { CSS } from '@dnd-kit/utilities';
import Container from './fabric/container';
import { Drag } from 'grommet-icons';
import { DraggableBox, DragHandle } from '../components';

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
      <Box>
        {uid}
        {path && (
          <Container path={path} uid={uid}>
          </Container>
        )}
      </Box>
    </DraggableBox>
  );
};

export default Row;
