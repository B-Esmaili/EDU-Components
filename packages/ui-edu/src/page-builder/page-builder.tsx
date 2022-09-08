import PageBuilderRoot from "./page-builder-root";
import { PageContext } from "./page-context";

export interface PageComponent{
   id: string;
   Component : React.Component
}

export interface PageBuilderProps {
    components : PageComponent []
}

const PageBuilder : React.FC<PageBuilderProps> = (props)=>{


    return  <PageContext>
       <PageBuilderRoot/>
    </PageContext>
}

export {PageBuilder}