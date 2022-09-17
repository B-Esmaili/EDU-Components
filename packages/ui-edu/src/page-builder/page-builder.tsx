import { Box } from 'grommet';
import PageBuilderRoot from './page-builder-root';
import { PageContext } from './page-context';
import { PageComponent } from './types';
import {useForm} from "react-hook-form";
import { EditorForm } from './editor-form';

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
  const methods = useForm({
    defaultValues: data,
  });

  //const allComponents = [builtinModules,...components];

  return (
    <PageContext formMethods={methods}>
      <Box pad="medium">
        <PageBuilderRoot />
        {/* <EditorForm formMethods={methods}>
        </EditorForm> */}
      </Box>
    </PageContext>
  );
};

export { PageBuilder };
