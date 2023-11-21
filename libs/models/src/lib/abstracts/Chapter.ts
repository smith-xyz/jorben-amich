import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Chapter {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int')
  chapterNumber: number;

  @Column('varchar')
  title: string;
}
