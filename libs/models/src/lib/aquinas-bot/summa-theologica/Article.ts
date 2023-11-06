import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';
import { ArticleContent } from './ArticleContent';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Question, (question) => question.articles)
  question: Question;

  @Column('int')
  articleNumber: number;

  @Column('varchar')
  title: string;

  @OneToMany(() => ArticleContent, (articleContent) => articleContent.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  articleContents: ArticleContent[];
}
