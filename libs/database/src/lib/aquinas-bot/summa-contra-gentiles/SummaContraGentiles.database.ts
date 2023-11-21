import { getDataSourceOptions } from './config';
import { DataSource } from 'typeorm';

const SummaContraGentilesDb = new DataSource(getDataSourceOptions());

export default SummaContraGentilesDb;
