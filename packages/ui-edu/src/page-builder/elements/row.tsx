import { useSortable } from '@dnd-kit/sortable';
import { Box } from 'grommet';
import styled from 'styled-components';
import { PageComponent, PageElementProps } from '../types';
import useElement from '../use-element';
import { CSS } from '@dnd-kit/utilities';

export interface RowModel {}
export interface RowProps extends PageElementProps {}

const DraggableBox = styled(Box)<{ transform?: string; transition?: string }>`
  ${({ transform }) => transform && `transform:${transform};`}
  ${({ transition }) => transition && `transition:${transition};`}
`;

const Row: PageComponent<RowModel, RowProps> = (props) => {
  const { path } = props;
  
  const {uid} = useElement(path);
  
  const { attributes, listeners, setNodeRef, transform, transition } =
   useSortable({ id: uid ?? path });

  const transformValue = CSS.Transform.toString(transform);

  return (
    <DraggableBox
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      transform={transformValue}
      transition={transition}
    >
        {uid}
    </DraggableBox>
  );
};

export default Row;
