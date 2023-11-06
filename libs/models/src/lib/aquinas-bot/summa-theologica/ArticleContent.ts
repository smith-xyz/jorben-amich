import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Article } from './Article';

/**
 * pr. — prologue to a question - won't be used here but is part of the nomenclature
 * arg. — objections
 * s. c. — “On the contrary”
 * co. — “I respond that”
 * ad. — replies to objections
 * if none provided, default is _I answer that or "co"
 */
export type SubSection = 'pr.' | 'arg.' | 's. c.' | 'co.' | 'ad.';

@Entity()
export class ArticleContent {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => Article, (article) => article.articleContents)
  article: Article;

  @Column('varchar', { length: 5 })
  subSection: SubSection;

  @Column('int', { nullable: true })
  subSectionValue: number;

  @Column('varchar')
  content: string;
}
