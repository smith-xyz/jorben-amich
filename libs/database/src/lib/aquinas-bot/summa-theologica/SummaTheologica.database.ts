import { getSummaTheologicaDataSourceOptions } from './config';
import { DataSource } from 'typeorm';

const SummaTheologicaDb = new DataSource(getSummaTheologicaDataSourceOptions());

export default SummaTheologicaDb;
