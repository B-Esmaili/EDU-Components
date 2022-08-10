import { ToastContextProvider } from "../use-toast/toast-context"

export interface UIProviderProps { 
   children?:React.ReactNode   
}

export const UIProvider : React.FC<UIProviderProps> = ({children})=>{

      
      return (
            <ToastContextProvider>
                 {children}
            </ToastContextProvider>
      )
}