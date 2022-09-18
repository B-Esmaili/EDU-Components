import { createContext } from "react";

export interface PageElementId{
    uid:string,
    path:string
}

export interface PageBuilderContextValue {
    setActiveElementId : (elementId : PageElementId | null)=>void;
    activeElementId : PageElementId | null;
}

const ContextValue : PageBuilderContextValue = {
    setActiveElementId : ()=>void 0,
    activeElementId:null
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