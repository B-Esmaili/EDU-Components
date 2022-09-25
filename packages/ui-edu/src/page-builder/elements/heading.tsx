import {
  ElementClass,
  ElementClassValues,
  ElementType,
  PageComponent,
  PageComponentEditor,
  PageElementProps,
} from '../types';
import { Box, Heading as GrommetHeading, HeadingProps } from 'grommet';
import { PropType } from '@atomic-web/ui-core';
import { FieldView, FormFieldType } from 'styled-hook-form';
import useElement from '../use-element';
import { Subscript } from 'grommet-icons';
import { useToolBox } from '../use-toolbox';

export interface HeadingConfig {
  level: PropType<HeadingProps, 'level'>;
}

const HEADING_CLASSES: ElementClassValues[] = [ElementClass.Primitive];

const Heading: PageComponent<Record<string, never>, PageElementProps> = (
  props
) => {
  const { path } = props;

  const { uid, config } = useElement<Record<string, never>, HeadingConfig>(
    path
  );

  const { toolBoxView, setNodeRef, itemStyle } = useToolBox({
    id: uid,
    classes: HEADING_CLASSES,
  });

  return (
    <Box style={{ ...itemStyle }}>
      {toolBoxView}
      <GrommetHeading ref={setNodeRef} level={config.level}>
        Heading
      </GrommetHeading>
    </Box>
  );
};

Heading.displayName = 'Heading';
Heading.icon = <Subscript />;

Heading.ctor = () => {
  return {
    elementClass: ElementClass.Layout,
    type: ElementType.FabricElement,
    model: {},
    config: {
      level: '3',
    },
    classes: [ElementClass.Primitive],
  };
};

export const Editor: PageComponentEditor = (props) => {
  const { path } = props;
  return (
    <Box>
      <FieldView
        name={`${path}.config.level`}
        label="Level"
        type={FormFieldType.DropDown}
        defaultValue="6"
        options={[
          {
            name: '1',
            value: '1',
          },
          {
            name: '2',
            value: '2',
          },
          {
            name: '3',
            value: '3',
          },
          {
            name: '4',
            value: '4',
          },
          {
            name: '5',
            value: '5',
          },
          {
            name: '6',
            value: '6',
          },
        ]}
        itemValueKey="value"
        itemLabelKey="name"
      />
    </Box>
  );
};

export default Heading;
