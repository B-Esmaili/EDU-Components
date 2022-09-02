import {Box} from "grommet"

export interface PageComponent{
   id: string;
   Component : React.Component
}

export interface PageBuilderProps {
    components : PageComponent []
}

const PageBuilder : React.FC<PageBuilderProps> = (props)=>{

        

    return  <Box>
       
    </Box>
}

export {PageBuilder}