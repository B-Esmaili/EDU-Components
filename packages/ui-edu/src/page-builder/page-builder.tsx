import { Box } from 'grommet';
import PageBuilderRoot from './page-builder-root';
import { PageContext } from './page-context';
import { PageComponent } from './types';

export interface PageComponentMeta {
  id: string;
  Component: PageComponent;
}

export interface PageBuilderProps {
  components: PageComponentMeta[];
  data: any;
}

const PageBuilder: React.FC<PageBuilderProps> = (props) => {
  const { data } = props;

  //const allComponents = [builtinModules,...components];

  return (
    <PageContext data={data}>
      <Box pad="medium">
        <PageBuilderRoot />
      </Box>
    </PageContext>
  );
};

export { PageBuilder };
