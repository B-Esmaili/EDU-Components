import { createContext } from "react";
import { PageComponentMeta } from "./page-builder";

export interface PageElementId{
    uid:string,
    path:string
}

export interface PageBuilderContextValue {
    setActiveElementId : (elementId : PageElementId | null)=>void;
    activeElementId : PageElementId | null;
    componentsMetadata : PageComponentMeta[];
}

const ContextValue : PageBuilderContextValue = {
    setActiveElementId : ()=>void 0,
    activeElementId:null,
    componentsMetadata : []
}

export const PageBuilderContext = createContext<PageBuilderContextValue>(ContextValue);

export interface PageBuilderContextProviderProps{
    value: PageBuilderContextValue;
    children:any;
}

export const PageBuilderContextProvider : React.FC<PageBuilderContextProviderProps> = (props)=>{

    return <PageBuilderContext.Provider value={props.value}>
        {props.children}
    </PageBuilderContext.Provider>;
}