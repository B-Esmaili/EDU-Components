import { SortableContext } from '@dnd-kit/sortable';
import { Box } from 'grommet';
import { ElementClass, ElementType } from '../../types';
import useElement from '../../use-element';

export interface ContainerProps {
  id: string;
  children: React.ReactNode;
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
  const { id, children } = props;
  const { childElements, childElementsIds, addElement } = useElement(id);

  const handleAdd = () => {
    addElement(createRowElement());
  };

  return (
    <Box direction='column'>
      <SortableContext id={id} items={childElementsIds}>
        {childElements}
        {children}
      </SortableContext>
      <button onClick={handleAdd}>+</button>
    </Box>
  );
};

export default Container;
