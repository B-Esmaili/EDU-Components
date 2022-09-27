import { useCallback, useEffect, useRef } from 'react';
import { useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import uuid from '../utils/uid';
import { createElement, prepairElement } from './element-factory';
import {
  AddElementOptions,
  ElementClass,
  PageElement,
  UseElementReturn,
} from './types';

import { getParentId } from './utils/element';

const childs_prefix = 'children';

const elementMap = new Map<string, UseElementReturn>();

const useElement = function <TModel extends object = object,TConfig extends object = object>(
  elementId: string
): UseElementReturn<TModel,TConfig> {
  const modelProp = `${elementId}.model`;
  const configProp = `${elementId}.config`;
  const focusRef = useRef<number>();

  const { register, getValues, setValue, control ,watch} = useFormContext();

  const createElementStore = (options: AddElementOptions): PageElement => {
    const { model , config, classes, type, codeName, children } = options;

    const store: PageElement = {
      uid: uuid(),
      model: model ?? {},
      config: config?? {},
      class: classes ?? ElementClass.Primitive,
      type,
      codeName,
      children,
    };
    return store;
  };

  const itemArrayFieldName = `${elementId}.${childs_prefix}`;

  const { fields, append, remove, insert, swap, move, update } = useFieldArray({
    name: itemArrayFieldName,
    control: control,
    keyName: 'id',
  });

  if (!elementMap.size) {
    register(itemArrayFieldName, {
      value: [],
    });
  }

  const addElement = async (
    options: AddElementOptions | PageElement,
    index?: number,
    shouldFocus?: boolean
  ) => {
    const isExistingElement = Boolean((options as PageElement).uid);
    if (shouldFocus) {
      focusRef.current = index;
    }
    if (isExistingElement) {
      index != null ? insert(index, options) : append(options);
    } else {
      const element = createElementStore(options);
      try {
        await prepairElement(element);
        if (index != null) insert(index, element);
        else append(element);
      } catch (e) {
        return;
        //TODO: implement prepairation failure.
      }
    }
  };

  const removeElement = (index: number | number[]) => {
    remove(index);
  };

  const swapElements = (indexA: number, indexB: number) => {
    swap(indexA, indexB);
  };

  const updateCurrentElement = (model: Partial<TModel>) => {
    const _model = getValues(modelProp);
    const updatedModel = { ..._model, ...model };
    setValue(modelProp, updatedModel);
  };

  const getFields = () => getValues(itemArrayFieldName) as PageElement[];

  const getElementById = (id: string) => {
    return getFields().find((e) => e.uid === id);
  };

  const getElementIndexById = (id: string) => {
    return getFields().findIndex((e) => e.uid === id);
  };

  const getElement = (index: number): PageElement => {
    return getFields()[index];
  };

  const updateElement = (index: number, model: PageElement) => {
    prepairElement(model).then(() => {
      update(index, model);
    });
  };

  const model = useWatch({
    control,
    name: modelProp,
    defaultValue: {},
  });

  const config = useWatch({
    control,
    name: configProp,
    defaultValue: {},
  });

  const moveElement = (indexA: number, indexB: number) => {
    move(indexA, indexB);
  };

  const childElementsIds = useMemo(
    () => (fields as unknown as PageElement[]).map((f) => f.uid),
    [fields]
  );

  const getElementView = useCallback(
    (f: PageElement, idx: number) =>
      createElement(
        f,
        `${elementId}.${childs_prefix}.${idx}`,
        idx,
        focusRef.current === idx
      ),
    [elementId]
  );

  const VALUE = watch(`${elementId}.${childs_prefix}`);

  const childElements = useMemo(
    () =>
      {
        return (VALUE || []).map((f :PageElement, idx: number) => {
          return getElementView(f, idx);
        }) as React.ReactElement[];
      },
    [VALUE, getElementView]
  );

  const uid = useMemo(
    () => getValues(elementId)?.uid ?? '',
    [elementId, getValues]
  );

  const element: UseElementReturn<TModel,TConfig> = {
    addElement,
    moveElement,
    swapElements,
    updateModel: updateCurrentElement,
    getElementIndexById,
    getElementById,
    getElementView,
    removeElement,
    getElement,
    updateElement,
    childElementsIds,
    childElements,
    config,
    model,
    uid,
  };

  elementMap.set(elementId, element);

  useEffect(() => {
    return () => {
      elementMap.delete(elementId);
    };
  }, [elementId]);

  return element;
};

const useExistingElement = function <TModel extends object = object>(
  elementId: string
): UseElementReturn<TModel> | undefined {
  return elementMap.get(elementId) as unknown as UseElementReturn<TModel>;
};

const useParentElement = function <TModel extends object = object>(
  elementId: string
): UseElementReturn<TModel> | undefined {
  const parentId = getParentId(elementId);
  return useExistingElement<TModel>(parentId);
};

export { useElement as default, useParentElement, useExistingElement };
