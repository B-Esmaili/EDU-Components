import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button } from 'grommet';
import { Add } from 'grommet-icons';
import { ElementClass, ElementType } from '../../types';
import useElement from '../../use-element';

export interface ContainerProps {
  path: string;
  uid: string;
  children?: React.ReactNode;
}

export const createRowElement = (content = '') => {
  return {
    codeName: 'row',
    elementClass: ElementClass.Block,
    type: ElementType.FabricElement,
    model: {
      content,
    },
  };
};

const Container: React.FC<ContainerProps> = (props) => {
  const { path, children } = props;
  const { childElements, childElementsIds, addElement } = useElement(path);

  const handleAdd = () => {
    addElement(createRowElement());
  };

  const { setNodeRef } = useDroppable({ id: path });

  return (
    <Box direction="column">
      <SortableContext
        id={path}
        items={childElementsIds}
        strategy={verticalListSortingStrategy}
      >
        <Box
          ref={setNodeRef}
          pad="small"
          border={{ color: 'green', size: 'small', style: 'dashed' }}
        >
          {childElements}
          {children}
        </Box>
        <Box align='center'>
          <Box width="2em">
            <Button icon={<Add />} onClick={handleAdd} />
          </Box>
        </Box>
        {/* <DropPlaceholder onClick={handleAdd} id={uid}/> */}
      </SortableContext>
    </Box>
  );
};

export default Container;
