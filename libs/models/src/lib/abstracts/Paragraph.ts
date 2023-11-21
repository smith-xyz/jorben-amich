import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Paragraph {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int')
  paragraphNumber: number;

  @Column('varchar')
  content: string;
}
