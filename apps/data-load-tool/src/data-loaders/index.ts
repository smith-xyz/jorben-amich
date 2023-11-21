import { loadSummaTheologicaData } from './summa-theologica';
import { loadSummaContraGentilesData } from './summa-contra-gentiles';

export const apps = {
  'aquinas-bot': {
    'summa-theologica': loadSummaTheologicaData,
    'summa-contra-gentiles': loadSummaContraGentilesData,
  },
};
