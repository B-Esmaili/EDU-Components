import { Box } from 'grommet';
import PageBuilderRoot from './page-builder-root';
import { PageContext } from './page-context';
import { ElementCategory, PageComponent, PageElement } from './types';
import { useForm } from 'react-hook-form';
import { EditorForm } from './editor-form';
import { useEffect } from 'react';
import {PartialDeep} from 'type-fest'
import { PropType } from '@atomic-web/ui-core';

export interface PageComponentMeta {
  id: string;
  Component: PageComponent;
  icon: React.ReactNode;
  label: string;
  classes: PropType<PageElement,'classes'>;
  categories : PropType<PageElement,'categories'> ;
}

export type ElementCategoryLocalization = {
  [key in ElementCategory]: {
    title : string,
    icon : JSX.Element | React.ReactNode
  };
}

export interface PageBuilderLocalization {
  elementCategories: ElementCategoryLocalization;
}

export interface PageBuilderProps {
  components: PageComponentMeta[];
  data: any;
  localization?: PartialDeep<PageBuilderLocalization>;
}

const PageBuilder: React.FC<PageBuilderProps> = (props) => {
  const { data ,localization } = props;
  const methods = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    if (data.root) {
      methods.reset(data);
      methods.register('root');
    }
  }, [data, methods]);

  //const allComponents = [builtinModules,...components];

  return (
    <PageContext formMethods={methods} localization={localization}>
      <Box pad="medium">
        <PageBuilderRoot />
        <EditorForm formMethods={methods}></EditorForm>
      </Box>
    </PageContext>
  );
};

export { PageBuilder };
