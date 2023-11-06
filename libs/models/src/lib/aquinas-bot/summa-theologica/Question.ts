import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Part } from './Part';
import { Article } from './Article';
import { QuestionPrologue } from './QuestionPrologue';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Part, (part) => part.questions)
  part: Part;

  @OneToMany(() => Article, (article) => article.question, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  articles: Article[];

  @Column('int')
  questionNumber: number;

  @Column('varchar')
  title: string;

  @OneToOne(() => QuestionPrologue, (qp) => qp.question, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  prologue: QuestionPrologue;
}
