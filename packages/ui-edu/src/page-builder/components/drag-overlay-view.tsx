import useElement from '../use-element';

export interface DragOverlayProps {
  parentPath: string;
  itemId: string;
}

export const DragOverlayView: React.FC<DragOverlayProps> = (props) => {
  const { getElementById, getElementIndexById, getElementView } = useElement(
    props.parentPath as string
  );

  const element = getElementById(props.itemId);
  if (element) {
    const view = getElementView(element, getElementIndexById(props.itemId));
    return view;
  }
  return null;
};
