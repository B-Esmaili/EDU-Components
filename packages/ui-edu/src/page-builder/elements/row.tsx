import { useSortable } from '@dnd-kit/sortable';
import { Box, Button } from 'grommet';
import { PageComponent, PageElementProps } from '../types';
import useElement from '../use-element';
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
        {path && (
          <Container path={path} uid={uid}>
          </Container>
        )}
      </Box>
    </DraggableBox>
  );
};

export const Editor = ()=>{
  
  return <Box>
    
  </Box>
}

export default Row;
