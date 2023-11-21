import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chapter } from './Chapter';

export abstract class Book {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { length: 55 })
  name: string;
}
