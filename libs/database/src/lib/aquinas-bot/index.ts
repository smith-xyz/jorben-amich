import { AquinasBotDatabase } from '@shared/types';
import SummaTheologicaDb from './summa-theologica/SummaTheologica.database';
import SummaContraGentilesDb from './summa-contra-gentiles/SummaContraGentiles.database';

/**
 * @description object that will reference data storage that will be a specific work
 */
export const aquinasDatabase: AquinasBotDatabase = {
  'summa-theologica': SummaTheologicaDb,
  'summa-contra-gentiles': SummaContraGentilesDb,
};
