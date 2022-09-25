import { PropType } from "@atomic-web/ui-core";
import { useSortable } from "@dnd-kit/sortable";
import { ParagraphProps , Paragraph as GrommetParagraph, Box } from "grommet";
import { TextAlignFull } from "grommet-icons";
import { useContext } from "react";
import { FieldView, FormFieldType } from "styled-hook-form";
import { ElementClass, ElementClassValues, ElementType, PageComponent, PageComponentEditor, PageElementProps } from "../types";
import useElement from "../use-element";
import { ContainerContext } from "./fabric/container";

export interface HeadingConfig {
    maxLines: PropType<ParagraphProps, 'maxLines'>;
}

const HEADING_CLASSES: ElementClassValues[] = [ElementClass.Primitive];

const Paragraph: PageComponent<Record<string, never>, PageElementProps> = (
  props
) => {
  const { path } = props;

  const { uid, config } = useElement<Record<string, never>, HeadingConfig>(
    path
  );

  const { accept: parentAccept } = useContext(ContainerContext);

  const { attributes, listeners, setNodeRef } = useSortable({
    id: uid,
    data: {
      classes: HEADING_CLASSES,
      parentAccept,
    },
  });

  return (
    <GrommetParagraph
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      maxLines={config.maxLines}
    >
      Paragraph
    </GrommetParagraph>
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
    classes: [ElementClass.Primitive],
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
