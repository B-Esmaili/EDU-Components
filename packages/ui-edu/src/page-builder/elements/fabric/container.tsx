import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button, Grid, Layer } from 'grommet';
import { Add } from 'grommet-icons';
import { createContext, useContext, useState } from 'react';
import { PageComponentMeta } from '../../page-builder';
import { PageBuilderContext } from '../../page-builder-context';
import { ElementClassValues } from '../../types';
import useElement from '../../use-element';

export interface ContainerProps {
  path: string;
  uid: string;
  children?: React.ReactNode;
  accept?: ElementClassValues[];
}

export interface ContainerContextValue {
  accept?: ElementClassValues[];
}

export const ContainerContext = createContext<ContainerContextValue>({});

const Container: React.FC<ContainerProps> = (props) => {
  const { path, children, accept } = props;
  const { childElements, childElementsIds, addElement } = useElement(path);
  const [showComponentSelection, setshowComponentSelection] = useState(false);

  const handleAdd = () => {
    setshowComponentSelection(true);
  };

  const { componentsMetadata } = useContext(PageBuilderContext);

  const { setNodeRef } = useDroppable({
    id: path,
    data: {
      accept,
    },
  });

  const handleCloseComponentSelection = () => {
    setshowComponentSelection(false);
  };

  const handleComponentSelect = (meta: PageComponentMeta) => {    
    if (
      accept &&
      !accept.some((c) => c === '*') &&
      !meta.classes.some((c) => accept?.includes(c))
    ) {
      return;
    }

    const newel = {
      codeName: meta.id,
      ...meta.Component.ctor(),
    };

    addElement(newel);
  };

  return (
    <Box direction="column">
      <SortableContext
        id={path}
        items={childElementsIds}
        strategy={verticalListSortingStrategy}
      >
        <ContainerContext.Provider
          value={{
            accept,
          }}
        >
          <Box
            ref={setNodeRef}
            pad="small"
            border={{ color: 'green', size: 'small', style: 'dashed' }}
          >
            {childElements}
            {children}
          </Box>
        </ContainerContext.Provider>
        <Box align="center">
          <Box width="2em">
            <Button icon={<Add />} onClick={handleAdd} />
          </Box>
        </Box>
        <ComponentSelectionPanel
          componentsMetadata={componentsMetadata}
          show={showComponentSelection}
          onClose={handleCloseComponentSelection}
          onSelect={handleComponentSelect}
        />
        {/* <DropPlaceholder onClick={handleAdd} id={uid}/> */}
      </SortableContext>
    </Box>
  );
};

export interface ComponentSelectionPabelProps {
  componentsMetadata: PageComponentMeta[];
  show: boolean;
  onClose?: () => void;
  onSelect?: (met: PageComponentMeta) => void;
}

const ComponentSelectionPanel: React.FC<ComponentSelectionPabelProps> = (
  props
) => {
  const { onClose, show, componentsMetadata, onSelect } = props;

  const handleSelect = (meta: PageComponentMeta) => () => {
    onSelect?.(meta);
    onClose?.();
  };

  return show ? (
    <Layer onClickOutside={onClose}>
      <Grid width="large" columns={{
        count:"fit",
        size:"xsmall"
      }} pad="small" gap="small">
        {componentsMetadata.length &&
          componentsMetadata.map((meta) => (
            <Box
              align="center"
              pad="medium"
              onClick={handleSelect(meta)}
              hoverIndicator="background-back"              
              border={{
                size: '2px',
                color: 'brand',
                style: 'solid',
              }}
              round="xsmall"
            >
              <Box>{meta.icon}</Box>
              <Box>{meta.label}</Box>
            </Box>
          ))}
      </Grid>
    </Layer>
  ) : null;
};

export default Container;
