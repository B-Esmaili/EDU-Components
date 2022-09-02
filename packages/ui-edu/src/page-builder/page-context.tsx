import { FormProvider, useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

const PageContext = ({ children }: any) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <DevTool placement="top-right" control={methods.control} />
      {children}
    </FormProvider>
  );
};

export { PageContext };
