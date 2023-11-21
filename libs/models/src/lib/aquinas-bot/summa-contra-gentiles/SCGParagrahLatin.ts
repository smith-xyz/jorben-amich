import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SCGParagraph } from './SCGParagraph';

@Entity({ name: 'paragraph_latin' })
export class SCGParagraphLatin {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => SCGParagraph, (paragraph) => paragraph.latinParagraph)
  paragraph: SCGParagraph;

  @Column('varchar')
  content: string;
}
