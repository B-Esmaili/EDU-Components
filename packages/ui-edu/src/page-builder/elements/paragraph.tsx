import { PropType } from '@atomic-web/ui-core';
import { useSortable } from '@dnd-kit/sortable';
import { ParagraphProps, Paragraph as GrommetParagraph, Box } from 'grommet';
import { TextAlignFull } from 'grommet-icons';
import { useContext } from 'react';
import { FieldView, FormFieldType } from 'styled-hook-form';
import {
  ElementCategory,
  ElementClass,
  ElementClassValues,
  ElementType,
  PageComponent,
  PageComponentEditor,
  PageElementProps,
} from '../types';
import useElement from '../use-element';
import { useToolBox } from '../use-toolbox';

export interface HeadingConfig {
  maxLines: PropType<ParagraphProps, 'maxLines'>;
}

const PARAGRAPH_CLASSES: ElementClassValues[] = [ElementClass.Primitive];

const Paragraph: PageComponent<Record<string, never>, PageElementProps> = (
  props
) => {
  const { path } = props;

  const { uid, config } = useElement<Record<string, never>, HeadingConfig>(
    path
  );

  const { toolBoxView, setNodeRef ,itemStyle } = useToolBox({
    id: uid,
    path,
    classes: PARAGRAPH_CLASSES,
  });

  return (
    <Box style={{ ...itemStyle }}>
      {toolBoxView}
      <GrommetParagraph ref={setNodeRef} maxLines={config.maxLines}>
        Paragraph
      </GrommetParagraph>
    </Box>
  );
};

Paragraph.displayName = 'Paragraph';
Paragraph.icon = <TextAlignFull />;

Paragraph.ctor = () => {
  return {
    elementClass: ElementClass.Layout,
    type: ElementType.FabricElement,
    model: {},
    config: {
      maxLines: 5,
    },
    classes: PARAGRAPH_CLASSES,
    categories:[ElementCategory.Standard]
  };
};

export const Editor: PageComponentEditor = (props) => {
  const { path } = props;
  return (
    <Box>
      <FieldView
        name={`${path}.config.maxLines`}
        label="Max Lines"
        type={FormFieldType.Number}
        defaultValue={5}
      />
    </Box>
  );
};

export default Paragraph;
