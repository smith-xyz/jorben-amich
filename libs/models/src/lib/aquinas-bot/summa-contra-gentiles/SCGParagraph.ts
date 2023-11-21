import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Paragraph } from '../../abstracts';
import { SCGChapter } from './SCGChapter';
import { SCGParagraphLatin } from './SCGParagrahLatin';

@Entity({ name: 'paragraph' })
export class SCGParagraph extends Paragraph {
  @ManyToOne(() => SCGChapter, (chapter) => chapter.paragraphs)
  chapter: SCGChapter;

  @OneToOne(() => SCGParagraphLatin, (qp) => qp.paragraph, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  latinParagraph: SCGParagraphLatin;
}
