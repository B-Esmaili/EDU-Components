import { ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { colors } from './colors';
import { hpe } from 'grommet-theme-hpe';

export interface AtomicThemeType extends ThemeType {
  dir?: 'rtl' | undefined;
}

const atomicTheme: AtomicThemeType = deepMerge(hpe, {
  defaultMode: 'light',
  global :{
    colors   
  },
  card : {
    container :{
      round:'xsmall'
    }
  }
});

export { atomicTheme };
