import { Entity, OneToOne } from 'typeorm';
import { Question } from './Question';
import { Prologue } from './Prologue';

@Entity()
export class QuestionPrologue extends Prologue {
  @OneToOne(() => Question, (question) => question.prologue)
  question: Question;
}
