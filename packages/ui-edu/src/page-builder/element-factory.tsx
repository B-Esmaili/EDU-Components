import { Box } from 'grommet';
import React, { ReactElement } from 'react';

import dynamic from 'next/dynamic';
import { ElementType, PageElement } from './types';
import { PageComponentMeta } from './page-builder';
import Row from './elements/row';
import Heading from './elements/heading';
import Paragraph from './elements/paragraph';

const getElementKey = (codeName: string) => `./elements/${codeName}`;

const builtInComponents: PageComponentMeta[] = [
  {
    id: 'row',
    Component: Row,
    icon : Row.icon,
    label : Row.displayName,
    classes : []
  },
  {
    id: 'heading',
    Component: Heading,
    icon : Heading.icon,
    label : Heading.displayName,
    classes : []
  },
  {
    id: 'paragraph',
    Component: Paragraph,
    icon : Paragraph.icon,
    label : Paragraph.displayName,
    classes : []
  }
];

const elementCache = new Map<string, React.ComponentType>();

builtInComponents.forEach((component) =>
  elementCache.set(
    getElementKey(component.id),
    component.Component as unknown as React.ComponentType
  )
);

export const createElement = (
  element: PageElement,
  path: string,
  index: number,
  shouldFocus = false
): ReactElement | null => {
  if (!element) {
    return null;
  }
  if (element.type === ElementType.FabricElement) {
    return createFabricElement(element, path, index, shouldFocus);
  }

  return <Box />;
};

export const getElementEditorComponent = async (
  element: PageElement,
) : Promise<React.ComponentType> => {
  return new Promise((res, rej) => {
    prepairElement(element , (c)=>c.Editor)
      .then((c) =>
        res(
          c
        )
      )
      .catch((e) => rej(e));
  });
};

export const prepairElement = (
  model: PageElement,
  componentSelector?: (module: any) => any
): Promise<any> => {
  if (!model) {
    return Promise.reject();
  }
  return new Promise((res, rej) => {
    try {
      const elementPath = getElementKey(model.codeName);
      const loadingComponent = dynamic(() =>
        //https://stackoverflow.com/questions/62942727/dynamic-importing-of-an-unknown-component-nextjs
        import('' + elementPath).then((c) =>
          componentSelector ? componentSelector(c) : c.default
        )
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      loadingComponent.render.preload().then((component: any) => {
        if (!componentSelector){
          elementCache.set(elementPath, component);
        }
        res(component);
      });
    } catch (err) {
      rej(err);
    }
  });
};

const createFabricElement = (
  model: PageElement,
  path: string,
  index: number,
  shouldFocus = false
): ReactElement | null => {
  const component = elementCache.get(getElementKey(model.codeName));
  if (!component) {
    return null;
  }

  const element = React.createElement<any>(component, {
    key: model.uid,
    index,
    path,
    shouldFocus,
  });
  return element;
};


export {
  builtInComponents as builtInComponentsMeta
}