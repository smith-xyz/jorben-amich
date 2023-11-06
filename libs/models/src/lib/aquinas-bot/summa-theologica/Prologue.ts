import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class Prologue {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar')
  content: string;
}
