import { aquinasDatabase } from './lib';

/** Prepared database per app */
export const database = {
  'aquinas-bot': aquinasDatabase,
};

/** exposing Entities to be used */
export * from './lib';
