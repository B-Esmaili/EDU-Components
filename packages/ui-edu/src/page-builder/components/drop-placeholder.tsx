import { useDroppable } from '@dnd-kit/core';
import { Box, BoxProps, Button } from 'grommet';
import { Add } from 'grommet-icons';

export interface DropPlaceholderProps extends BoxProps {
  icon?: JSX.Element;
  id:string;
}

const DropPlaceholder: React.FC<DropPlaceholderProps> = (props) => {
  const { icon, id, ...rest } = props;

  const { setNodeRef } = useDroppable({
    id: id + 'pl',
  });

  return (
    <Box {...rest} align="center" focusIndicator={false} ref={setNodeRef}>
      <Box
        width="small"
        background="light-3"
        round="small"
        align="center"
        focusIndicator={false}
      >
        <Button>{icon ?? <Add />}</Button>
      </Box>
    </Box>
  );
};

export { DropPlaceholder };
