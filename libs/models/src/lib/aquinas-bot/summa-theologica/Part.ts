import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './Question';
import { PartPrologue } from './PartPrologue';

export type PartValue = 'I' | 'I-II' | 'II-II' | 'III';

export type PartName =
  | 'First Part (Prima Pars)'
  | 'First Part of the Second Part (Prima Secundæ Partis)'
  | 'Second Part of the Second Part (Secunda Secundæ Partis)'
  | 'Third Part (Tertia Pars)';

@Entity()
export class Part {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { length: 55 })
  name: PartName;

  @Column('varchar', { length: 5 })
  value: PartValue;

  @OneToOne(() => PartPrologue, (partPrologue) => partPrologue.part, {
    nullable: true, // at least II-II doesn't have a prologue since it belongs to part II as whole
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  prologue?: PartPrologue;

  @OneToMany(() => Question, (question) => question.part, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: Question[];
}
