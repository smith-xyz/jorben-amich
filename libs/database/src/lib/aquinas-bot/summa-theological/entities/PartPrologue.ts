import { Entity, OneToOne } from 'typeorm';
import { Part } from './Part';
import { Prologue } from './Prologue';

@Entity()
export class PartPrologue extends Prologue {
  @OneToOne(() => Part, (part) => part.prologue)
  part: Part;
}
