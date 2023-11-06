import SummaTheologicaDb from './summa-theologica/SummaTheologica.database';

/**
 * @description object that will reference data storage that will be a specific work
 */
export const aquinasDatabase = {
  'summa-theologica': SummaTheologicaDb,
};

/** exposing configs */
export * from './summa-theologica';
