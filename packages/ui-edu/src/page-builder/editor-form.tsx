import React from "react";
import {UseFormReturn} from "react-hook-form";
import { FormBuilder } from "styled-hook-form";

export interface EditorFormProps{
    children?:React.ReactNode;
    formMethods :UseFormReturn<any>;
}

const EditorForm : React.FC<EditorFormProps> = (props)=>{

    const {children,formMethods}  = props;

    return  <FormBuilder formMethods={formMethods}>
          {children}
    </FormBuilder>
}

export {
    EditorForm
};