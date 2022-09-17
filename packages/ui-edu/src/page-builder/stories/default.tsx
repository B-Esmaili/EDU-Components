import { Box } from "grommet"
import uid from "../../utils/uid";
import { PageBuilder } from "../page-builder"
import { ElementClass, ElementType } from "../types";

export default {
    title :"PageBuilder/Default"
}

export const createRowElement = (content = '') => {
    return {
      uid:uid(),  
      codeName: 'row',
      elementClass: ElementClass.Block,
      type: ElementType.FabricElement,
      model: {
        content,
      },
    };
  };

export const Default = ()=>{
    
    const data = {
        root:{
            children:[
                createRowElement(),
                createRowElement()
            ]
        }
    }

    return <Box>
        <PageBuilder components={[]} data={data}/>
    </Box>
}