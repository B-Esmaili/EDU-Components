import { ReactElement } from "react";

export enum ElementType {
  FabricElement = 1,
  ExternalElement = 2,
}

export enum ElementClass {
  'Block' = 1,
  'Primitive' = 2,
}

export interface PageElement<TModel extends object = object>
  extends Record<string, unknown> {
  id?: string;
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

export interface UseElementReturn<TModel extends object = object> {
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
  getElement: (index: number) => PageElement | undefined;
  childElements: ReactElement[];
  model: TModel;
}
