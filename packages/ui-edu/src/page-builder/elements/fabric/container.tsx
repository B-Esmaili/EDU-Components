import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Button, Grid, Layer, Text } from 'grommet';
import { Add } from 'grommet-icons';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { PageComponentMeta } from '../../page-builder';
import { PageBuilderContext } from '../../page-builder-context';
import { ElementCategory, ElementClass, ElementClassValues } from '../../types';
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
  const { path, children, accept = [ElementClass.Row] } = props;
  const { childElements, childElementsIds, addElement } = useElement(path);
  const [showComponentSelection, setshowComponentSelection] = useState(false);

  const handleAdd = () => {
    setshowComponentSelection(true);
  };

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
      (!meta.classes || !meta.classes.some((c) => accept?.includes(c)))
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
            pad={childElements.length ? undefined : 'small'}
            border={{ color: 'green', size: 'small', style: 'dashed' }}
          >
            {childElements}
            {children}
          </Box>
        </ContainerContext.Provider>
        <Box align="center">
          <Box width="2em" margin={{ top: 'xsmall' }}>
            <Button plain icon={<Add size="medium" />} onClick={handleAdd} />
          </Box>
        </Box>
        <ComponentSelectionPanel
          accept={accept}
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
  show: boolean;
  accept: ElementClassValues[];
  onClose?: () => void;
  onSelect?: (met: PageComponentMeta) => void;
}

const ComponentSelectionPanel: React.FC<ComponentSelectionPabelProps> = (
  props
) => {
  const { onClose, show, onSelect, accept } = props;
  const { componentsMetadata, localization } = useContext(PageBuilderContext);

  const elementCategoriesHavingItems = useMemo(
    () =>
      accept.includes('*')
        ? localization.elementCategories
        : Object.keys(localization.elementCategories)
            .filter((k) =>
              componentsMetadata
                .some(
                  (m) =>
                    m.categories.includes(k as ElementCategory) &&
                    accept.some((a) => m.classes?.includes(a))
                )
            )
            .reduce((p, c) => {
              p[c] = (localization.elementCategories as Record<string, any>)[c];
              return p;
            }, {} as Record<string, any>),
    [accept, componentsMetadata, localization.elementCategories]
  );

  const handleSelect = (meta: PageComponentMeta) => () => {
    onSelect?.(meta);
    onClose?.();
  };

  const [activeCat, setActiveCat] = useState(
    Object.keys(elementCategoriesHavingItems)[0]
  );

  const handleCategorySelect = useCallback(
    (cat: string) => () => {
      setActiveCat(cat);
    },
    []
  );

  const categoryMetadata = useMemo(
    () =>
      componentsMetadata.filter(
        (m) =>
          (accept.includes('*') ||
            m.classes?.some((c) => accept.includes(c))) &&
          m.categories.includes(activeCat as ElementCategory)
      ),
    [accept, activeCat, componentsMetadata]
  );

  return show ? (
    <Layer onClickOutside={onClose}>
      <Grid
        width="large"
        columns={['10em', 'flex']}
        rows={['auto']}
        areas={[
          { name: 'category', start: [0, 0], end: [0, 0] },
          { name: 'list', start: [1, 0], end: [1, 0] },
        ]}
        height={{ min: 'medium' }}
      >
        <Box gridArea="category" background="background-back" pad="small">
          {Object.keys(elementCategoriesHavingItems).map((cat) => (
            <Box
              key={cat}
              align="center"
              margin={{ bottom: 'xsmall' }}
              pad="xsmall"
              height="5em"
              justify="center"
              background={activeCat === cat ? 'brand' : undefined}
              onClick={handleCategorySelect(cat)}
            >
              <Box
                margin={{
                  bottom: 'small',
                }}
              >
                {
                  (elementCategoriesHavingItems as Record<string, any>)[cat]
                    .icon
                }
              </Box>
              <Text textAlign="center">
                {
                  (elementCategoriesHavingItems as Record<string, any>)[cat]
                    .title
                }
              </Text>
            </Box>
          ))}
        </Box>
        <Box gridArea="list">
          <Grid
            pad="small"
            columns={{
              count: 'fit',
              size: 'xsmall',
            }}
            gap="small"
          >
            {categoryMetadata.length > 0 &&
              categoryMetadata.map((meta) => (
                <Box
                  key={meta.id}
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
        </Box>
      </Grid>
    </Layer>
  ) : null;
};

export default Container;
