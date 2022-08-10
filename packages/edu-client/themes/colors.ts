import { PropType } from '../utils/types/prop-type';
import { AtomicThemeType } from './atomic-theme';

export const colors: PropType<
  PropType<AtomicThemeType, 'global'>,
  'colors'
> = {
    "brand":{
      dark : "#662e9b",
      light : "#e7bc91"
    },
    "background-back" : {
      light:"#f5f5f5",
      dark :"#252525"
    }
};
