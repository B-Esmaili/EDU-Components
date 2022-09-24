import React, { FC, ReactElement } from 'react';

export enum ElementType {
  FabricElement = 1,
  ExternalElement = 2,
}

export enum ElementClass {
  'Block' = 1,
  'Primitive' = 2,
  'Layout' = 3
}

export type ElementClassValues = ElementClass | "*";

export interface PageElement<TModel extends object = object>
  extends Record<string, unknown> {
  //id: string;
  uid: string;
  model: TModel;
  elementClass: ElementClass;
  type: ElementType;
  codeName: string;
}

export interface AddElementOptions {
  elementClass: ElementClass;
  model?: object;
  type: ElementType;
  codeName: string;
  children?: PageElement[];
}

export interface UseElementReturn<
  TModel extends object = object,
  TConfig extends object = object
> {
  addElement: (
    options: AddElementOptions | PageElement,
    index?: number,
    shouldFocus?: boolean
  ) => Promise<void>;
  removeElement: (index: number) => void;
  swapElements: (index1: number, index2: number) => void;
  moveElement: (index1: number, index2: number) => void;
  updateElement: (index: number, element: PageElement) => void;
  updateModel: (model: Partial<TModel>) => void;
  getElementById: (id: string) => PageElement | undefined;
  getElementIndexById: (id: string) => number;
  getElement: (index: number) => PageElement | undefined;
  getElementView: (
    element: PageElement,
    index: number
  ) => React.ReactElement | null;
  childElements: ReactElement[];
  childElementsIds: string[];
  model: TModel;
  config: TConfig;
  uid: string;
}

export interface PageElementProps {
  path: string;
  index: number;
  shouldFocus?: boolean;
}

export type PageComponentConstructor<TModel extends object = object> = () => {
  elementClass: ElementClass;
  type: ElementType;
  model?:TModel
};

export type PageComponent<
  TModel extends object = object,
  TProps extends PageElementProps = PageElementProps
> = FC<TProps> & {
  ctor: PageComponentConstructor<TModel>;
  displayName: string;
  icon: React.ReactNode;
};

export type PageComponentEditor<
  TProps extends {
    path: string;
    uid: string;
  } = {
    path: string;
    uid: string;
  }
> = FC<TProps>;
