import { useSortable } from '@dnd-kit/sortable';
import { Box, BoxExtendedProps, Button} from 'grommet';
import { Drag } from 'grommet-icons';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { ContainerContext } from './elements/fabric/container';
import { ElementClassValues } from './types';

export interface UseToolBoxOptions {
  id: string;
  sortable?:
    | boolean
    | Omit<Parameters<typeof useSortable>[0], 'id' | 'disabled'>;
  classes?: ElementClassValues[];
}
export interface UseToolBoxReturn {
  sortableInfo: ReturnType<typeof useSortable>;
  setNodeRef: (node: HTMLElement | null) => void;
  toolBoxView: JSX.Element | null;
  itemStyle: Record<string, string>;
}

export interface ToolBoxItem {
  title: string;
  icon: JSX.Element;
  itemRef?: (element: HTMLElement | null) => void;
  props?: Record<string, unknown>;
}

export interface ToolBoxProps extends BoxExtendedProps {
  itemId: string;
  items: ToolBoxItem[];
}

const ToolBoxItemView = styled(Box)``;

const StyledToolBox = styled(Box)<BoxExtendedProps>`
  position: absolute;
  bottom: 100%;
  left: 0;
`;

const ToolBox: React.FC<ToolBoxProps> = (props) => {
  const { items, itemId, ...rest } = props;

  return (
    <StyledToolBox
      direction="row"
      id={itemId}
      {...(rest as object)}
      background="brand"
      round="xsmall"
      pad="xsmall"
    >
      {items.map((item, i) => (
        <ToolBoxItemView key={i}>
          <Button size='xxsmall' plain icon={item.icon} ref={item.itemRef} {...item.props} />
        </ToolBoxItemView>
      ))}
    </StyledToolBox>
  );
};

const useToolBox = (options: UseToolBoxOptions): UseToolBoxReturn => {
  const { sortable = true, id, classes } = options;
  const { accept: parentAccept } = useContext(ContainerContext);

  const sortableInfo = useSortable({
    id,
    data: {
      classes,
      parentAccept,
    },
    ...(typeof sortable === 'boolean' ? null : sortable),
  });

  const toolboxItems = useMemo(() => {
    const items: ToolBoxItem[] = [];

    if (sortable) {
      items.push({
        itemRef: sortableInfo.setDraggableNodeRef,
        props: { ...sortableInfo.attributes, ...sortableInfo.listeners },
        icon: <Drag size='small'/>,
        title: 'Drag',
      });
    }
    return items;
  }, [sortable, sortableInfo]);

  const nodeRef = useRef<HTMLElement | null>(null);

  const setNodeRef = (node: HTMLElement | null) => {
    nodeRef.current = node;
    sortableInfo.setNodeRef(node);
  };

  const toolboxId = `tool_box_node_${id}`;
  const [isOver, setIsOver] = useState(false);
  const mouseLeaveTimerHandle = useRef<number | null>(null);

  const itemStyle = {
    position: 'relative',
  };

  const handleToolBoxHover = useCallback(() => {
    if (mouseLeaveTimerHandle.current) {
      console.log('clear time');
      clearTimeout(mouseLeaveTimerHandle.current);
    }
  }, [mouseLeaveTimerHandle]);

  const toolBoxView = useMemo(
    () =>
      isOver ? (
        <ToolBox
          onMouseEnter={handleToolBoxHover}
          itemId={toolboxId}
          items={toolboxItems}
        />
      ) : null,
    [isOver, handleToolBoxHover, toolboxId, toolboxItems]
  );

  useEffect(() => {
    const element = nodeRef.current;

    const handleMouseEnter = (e: MouseEvent) => {
      console.log('in');
      e.stopPropagation();
      setIsOver(true);
    };

    const handleMouseOut = (e: MouseEvent) => {
      mouseLeaveTimerHandle.current = setTimeout(() => {
        setIsOver(false);
        console.log('out');
      }, 500) as unknown as number;
      e.stopPropagation();
    };

    if (element) {
      element.addEventListener('mouseover', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseOut);
    }

    return () => {
      if (element) {
        element.removeEventListener('mouseover', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseOut);
      }
    };
  });

  return {
    sortableInfo,
    setNodeRef,
    toolBoxView,
    itemStyle,
  };
};

export { useToolBox };
