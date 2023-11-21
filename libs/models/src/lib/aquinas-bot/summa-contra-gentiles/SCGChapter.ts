import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Chapter } from '../../abstracts';
import { SCGBook } from './SCGBook';
import { SCGParagraph } from './SCGParagraph';

@Entity({ name: 'chapter' })
export class SCGChapter extends Chapter {
  @Column('varchar')
  latinTitle: string;

  @Column('varchar', { nullable: true })
  openingVerse: string;

  @Column('varchar', { nullable: true })
  latinOpeningVerse: string;

  @ManyToOne(() => SCGBook, (book) => book.chapters)
  book: SCGBook;

  @OneToMany(() => SCGParagraph, (paragraph) => paragraph.chapter, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  paragraphs: SCGParagraph[];
}
