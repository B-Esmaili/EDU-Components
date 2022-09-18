import { Box, Layer, Spinner } from 'grommet';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { FormBuilder } from 'styled-hook-form';
import { getElementEditorComponent } from './element-factory';
import { PageBuilderContext } from './page-builder-context';
import { useExistingElement, useParentElement } from './use-element';

export interface EditorFormProps {
  children?: React.ReactNode;
  formMethods: UseFormReturn<any>;
}

export interface EditorPanelProps {
  show: boolean;
  onClose? : ()=>void
}

const EditorPanel: React.FC<EditorPanelProps> = (props) => {
  const { show,onClose } = props;
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const methods = useFormContext();
  const { activeElementId , setActiveElementId } = useContext(PageBuilderContext);

  useEffect(() => {
    if (activeElementId) {
      const activeElement = methods.getValues(activeElementId.path);
      getElementEditorComponent(activeElement).then((editorComponent) => {
        setLoading(false);
        const element = React.createElement(editorComponent, {
          key: activeElement.uid,
          uid: activeElement.uid,
          path : activeElementId.path
        } as any);
        setEditor(element);
      });
    }
  }, [activeElementId, methods]);

  const handleClose = ()=>{
    setActiveElementId(null);
    onClose && onClose();
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {show && (
        <Layer position="right" full="vertical" background="background-back" onClickOutside={handleClose}>
          <Box width="medium" pad="small">
            {loading && (
              <Box fill={true} align="center" justify="center">
                <Spinner />
              </Box>
            )}
            {!loading && editor && editor}
          </Box>
        </Layer>
      )}
    </>
  );
};

const EditorForm: React.FC<EditorFormProps> = (props) => {
  const { children, formMethods } = props;
  const { activeElementId } = useContext(PageBuilderContext);

  const showEditor = useMemo(() => !!activeElementId, [activeElementId]);

  return (
    <FormBuilder formMethods={formMethods}>
      <EditorPanel show={showEditor} />
      {children}
    </FormBuilder>
  );
};

export { EditorForm };
