import { Column, Entity, OneToMany } from 'typeorm';
import { Book } from '../../abstracts';
import { SCGChapter } from './SCGChapter';

@Entity({ name: 'book' })
export class SCGBook extends Book {
  @Column('int')
  bookNumber: number;

  @OneToMany(() => SCGChapter, (chapter) => chapter.book, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  chapters: SCGChapter[];
}
