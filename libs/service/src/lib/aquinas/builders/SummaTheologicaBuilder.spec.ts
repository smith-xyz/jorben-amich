import { TestMemoryDatabase } from '@shared/test-utils';
import { PartName, PartValue, aquinasDatabase } from '@database';
import { SummaTheologicaBuilder } from './SummaTheologicaBuilder';

const { entities } = aquinasDatabase['summa-theologica'];

const testDb: TestMemoryDatabase = new TestMemoryDatabase({ entities });

let builder: SummaTheologicaBuilder;

describe('SummaTheologicaBuilder', () => {
  beforeAll(async () => {
    await testDb.setupTestDB();
    // cause it needs the entity manager when initializing the Part object which is dumb I know
    builder = new SummaTheologicaBuilder({
      rawData: createTestText(),
      em: testDb.source.manager,
      part: 'I',
    });
  });

  afterAll(async () => {
    await testDb.teardownTestDB();
  });

  it('will build the part with a prologue and empty questions array', () => {
    builder.buildPrologue();
    expect(builder.part.value).toEqual<PartValue>('I');
    expect(builder.part.name).toEqual<PartName>('First Part (Prima Pars)');
    expect(builder.part.questions).toEqual([]);
    expect(builder.part.prologue).toBeDefined();
    expect(builder.part.prologue.content).toEqual(
      "Because the Master of Catholic Truth ought not only to teach the proficient.\n\nEndeavoring to avoid these and other like faults, we shall try, by God's help."
    );
  });

  it('will build the questions and their titles with empty article arrays', () => {
    builder.buildQuestions();
    expect(builder.part.questions).toHaveLength(3);
    expect(
      builder.part.questions.map(({ questionNumber, title }) => ({
        questionNumber,
        title,
      }))
    ).toEqual([
      { questionNumber: 1, title: 'The Nature and Extent of Sacred Doctrine' },
      { questionNumber: 2, title: 'The Existence of God' },
      { questionNumber: 3, title: 'The Procession of the Divine Persons' },
    ]);
  });

  it('will build the question prologues and append to the questions list', () => {
    builder.buildQuestionPrologues();
    expect(builder.part.questions.every((q) => !!q.prologue)).toEqual(true);
    expect(
      builder.part.questions.map(({ prologue: { content } }) =>
        content.substring(0, 5)
      )
    ).toEqual(['THE N', 'THE E', 'OF TH']);
  });

  it('will build the articles and their titles with empty article content arrays', () => {
    builder.buildArticles();
    expect(builder.part.questions[0].articles).toHaveLength(2);
    expect(builder.part.questions[0].articles[0].articleNumber).toEqual(1);
    expect(builder.part.questions[0].articles[0].title).toEqual(
      'Whether, besides Philosophy, any Further Doctrine Is Required?'
    );
    expect(builder.part.questions[0].articles[1].articleNumber).toEqual(2);
    expect(builder.part.questions[0].articles[1].title).toEqual(
      'Whether Sacred Doctrine Is a Science?'
    );
    expect(builder.part.questions[1].articles).toHaveLength(1);
    expect(builder.part.questions[1].articles[0].articleNumber).toEqual(1);
    expect(builder.part.questions[1].articles[0].title).toEqual(
      'Whether, besides Philosophy, any Further Doctrine Is Required?'
    );
    expect(builder.part.questions[2].articles).toHaveLength(1);
    expect(builder.part.questions[2].articles[0].articleNumber).toEqual(1);
    expect(builder.part.questions[2].articles[0].title).toEqual(
      'Whether, besides Philosophy, any Further Doctrine Is Required?'
    );
  });

  it('will build the article contents for each article', () => {
    builder.buildArticleContents();
    expect(builder.part.questions[0].articles[0].articleContents).toHaveLength(
      6
    );

    expect(
      builder.part.questions[0].articles[0].articleContents.map(
        ({ subSection, subSectionValue }) => ({ subSection, subSectionValue })
      )
    ).toEqual([
      { subSection: 'arg.', subSectionValue: 1 },
      { subSection: 'arg.', subSectionValue: 2 },
      { subSection: 's. c.', subSectionValue: null },
      { subSection: 'co.', subSectionValue: null },
      { subSection: 'ad.', subSectionValue: 1 },
      { subSection: 'ad.', subSectionValue: 2 },
    ]);

    expect(builder.part.questions[0].articles[1].articleContents).toHaveLength(
      6
    );

    expect(
      builder.part.questions[0].articles[1].articleContents.map(
        ({ subSection, subSectionValue }) => ({ subSection, subSectionValue })
      )
    ).toEqual([
      { subSection: 'arg.', subSectionValue: 1 },
      { subSection: 'arg.', subSectionValue: 2 },
      { subSection: 's. c.', subSectionValue: null },
      { subSection: 'co.', subSectionValue: null },
      { subSection: 'ad.', subSectionValue: 1 },
      { subSection: 'ad.', subSectionValue: 2 },
    ]);

    expect(builder.part.questions[1].articles[0].articleContents).toHaveLength(
      1
    );

    expect(
      builder.part.questions[1].articles[0].articleContents.map(
        ({ subSection, subSectionValue }) => ({ subSection, subSectionValue })
      )
    ).toEqual([{ subSection: 's. c.', subSectionValue: null }]);

    expect(builder.part.questions[2].articles[0].articleContents).toHaveLength(
      1
    );

    expect(
      builder.part.questions[2].articles[0].articleContents.map(
        ({ subSection, subSectionValue }) => ({ subSection, subSectionValue })
      )
    ).toEqual([{ subSection: 'co.', subSectionValue: null }]);
  });

  it('can save the part when passing through entity manager', async () => {
    const savedPart = await testDb.source.manager.save(builder.part);

    // if every relational entity has had the id set, then we are assured the
    // entity was saved into the database
    expect(savedPart.id).toBeDefined();
    expect(savedPart.prologue.id).toBeDefined();

    const listIdDefined = (entitiy: any) => !!entitiy.id;

    expect(savedPart.questions.every(listIdDefined)).toEqual(true);
    expect(
      savedPart.questions.every((question) =>
        question.articles.every(listIdDefined)
      )
    ).toEqual(true);
    expect(
      savedPart.questions.every((question) =>
        question.articles.every((article) =>
          article.articleContents.every(listIdDefined)
        )
      )
    ).toEqual(true);
  });
});

// putting this down here so its out of the way
function createTestText() {
  /** Test Text */
  return `ST. THOMAS AQUINAS

SUMMA THEOLOGICA

PART I ("Prima Pars")

Translated by
Fathers of the English Dominican Province

BENZIGER BROTHERS
NEW YORK
_______________________

CONTENTS

PROLOGUE

FIRST PART (QQ. 1-119)

Question

1.   The Nature and Extent of Sacred Doctrine
2.   The Existence of God

TREATISE ON THE TRINITY

3.  The Procession of the Divine Persons
_______________________

PROLOGUE

Because the Master of Catholic Truth ought not only to teach the
proficient.

Endeavoring to avoid these and other like faults, we shall try, by
God's help.
_______________________

SUMMA THEOLOGICA

FIRST PART
["I," "Prima Pars"]
_______________________

QUESTION 1

THE NATURE AND EXTENT OF SACRED DOCTRINE
(in Two Articles)

To place our purpose within proper limits, we first endeavor to
investigate the nature and extent of this sacred doctrine. Concerning
this there are ten points of inquiry:

(1) Whether it is necessary?
_______________________

FIRST ARTICLE [I, Q. 1, Art. 1]

Whether, besides Philosophy, any Further Doctrine Is Required?

Objection 1: It seems that, besides philosophical science, we have no
need of any further knowledge. For man should not seek to know what is
above reason: "Seek not the things that are too high for thee"
(Ecclus. 3:22). But whatever is not above reason is fully treated of
in philosophical science. Therefore any other knowledge besides
philosophical science is superfluous.

Obj. 2: Further, knowledge can be concerned only with being, for
nothing can be known, save what is true; and all that is, is true. But
everything that is, is treated of in philosophical science--even God
Himself; so that there is a part of philosophy called theology, or the
divine science, as Aristotle has proved (Metaph. vi). Therefore,
besides philosophical science, there is no need of any further
knowledge.

_On the contrary,_ It is written (2 Tim. 3:16): "All Scripture inspired
of God is profitable to teach, to reprove, to correct, to instruct in
justice." Now Scripture, inspired of God, is no part of philosophical
science, which has been built up by human reason. Therefore it is
useful that besides philosophical science, there should be other
knowledge, i.e. inspired of God.

_I answer that,_ It was necessary for man's salvation that there should
be a knowledge revealed by God besides philosophical science built up
by human reason. Firstly, indeed, because man is directed to God, as
to an end that surpasses the grasp of his reason: "The eye hath not
seen, O God, besides Thee, what things Thou hast prepared for them
that wait for Thee" (Isa. 66:4). But the end must first be known by men
who are to direct their thoughts and actions to the end. Hence it was
necessary for the salvation of man that certain truths which exceed
human reason should be made known to him by divine revelation. Even as
regards those truths about God which human reason could have
discovered, it was necessary that man should be taught by a divine
revelation; because the truth about God such as reason could discover,
would only be known by a few, and that after a long time, and with the
admixture of many errors. Whereas man's whole salvation, which is in
God, depends upon the knowledge of this truth. Therefore, in order
that the salvation of men might be brought about more fitly and more
surely, it was necessary that they should be taught divine truths by
divine revelation. It was therefore necessary that besides
philosophical science built up by reason, there should be a sacred
science learned through revelation.

Something else worth mentioning.

Reply Obj. 1: Although those things which are beyond man's
knowledge may not be sought for by man through his reason,
nevertheless, once they are revealed by God, they must be accepted by
faith. Hence the sacred text continues, "For many things are shown to
thee above the understanding of man" (Ecclus. 3:25). And in this, the
sacred science consists.

Reply Obj. 2: Sciences are differentiated according to the
various means through which knowledge is obtained. For the astronomer
and the physicist both may prove the same conclusion: that the earth,
for instance, is round: the astronomer by means of mathematics (i.e.
abstracting from matter), but the physicist by means of matter itself.
Hence there is no reason why those things which may be learned from
philosophical science, so far as they can be known by natural reason,
may not also be taught us by another science so far as they fall
within revelation. Hence theology included in sacred doctrine differs
in kind from that theology which is part of philosophy.
_______________________

SECOND ARTICLE [I, Q. 1, Art. 2]

Whether Sacred Doctrine Is a Science?

Objection 1: It seems that sacred doctrine is not a science. For every
science proceeds from self-evident principles. But sacred doctrine
proceeds from articles of faith which are not self-evident, since
their truth is not admitted by all: "For all men have not faith" (2
Thess. 3:2). Therefore sacred doctrine is not a science.

Obj. 2: Further, no science deals with individual facts. But this
sacred science treats of individual facts, such as the deeds of
Abraham, Isaac and Jacob and such like. Therefore sacred doctrine is
not a science.

_On the contrary,_ Augustine says (De Trin. xiv, 1) "to this science
alone belongs that whereby saving faith is begotten, nourished,
protected and strengthened." But this can be said of no science except
sacred doctrine. Therefore sacred doctrine is a science.

_I answer that,_ Sacred doctrine is a science. We must bear in mind that
there are two kinds of sciences. There are some which proceed from a
principle known by the natural light of intelligence, such as
arithmetic and geometry and the like. There are some which proceed
from principles known by the light of a higher science: thus the
science of perspective proceeds from principles established by
geometry, and music from principles established by arithmetic. So it
is that sacred doctrine is a science because it proceeds from
principles established by the light of a higher science, namely, the
science of God and the blessed. Hence, just as the musician accepts on
authority the principles taught him by the mathematician, so sacred
science is established on principles revealed by God.

Reply Obj. 1: The principles of any science are either in
themselves self-evident, or reducible to the conclusions of a higher
science; and such, as we have said, are the principles of sacred
doctrine.

Reply Obj. 2: Individual facts are treated of in sacred
doctrine, not because it is concerned with them principally, but they
are introduced rather both as examples to be followed in our lives (as
in moral sciences) and in order to establish the authority of those
men through whom the divine revelation, on which this sacred scripture
or doctrine is based, has come down to us.
_______________________

QUESTION 2

THE EXISTENCE OF GOD
(In One Articles)

As hitherto we have considered God as He is in Himself, we now go on
to consider in what manner He is in the knowledge of creatures;
concerning which there are thirteen points of inquiry:

(1) Whether any created intellect can see the essence of God?
_______________________

FIRST ARTICLE [I, Q. 2, Art. 1]

Whether, besides Philosophy, any Further Doctrine Is Required?

_On the contrary,_ Augustine says (De Trin. xiv, 1) "to this science
alone belongs that whereby saving faith is begotten, nourished,
protected and strengthened." But this can be said of no science except
sacred doctrine. Therefore sacred doctrine is a science.
_______________________

QUESTION 3

OF THE SIMPLICITY OF GOD
(In One Articles)

As hitherto we have considered God as He is in Himself, we now go on
to consider in what manner He is in the knowledge of creatures;
concerning which there are thirteen points of inquiry:

(1) Whether any created intellect can see the essence of God?
_______________________

FIRST ARTICLE [I, Q. 3, Art. 1]

Whether, besides Philosophy, any Further Doctrine Is Required?

_I answer that,_ It was necessary for man's salvation that there should
be a knowledge revealed by God besides philosophical science built up
by human reason.
_______________________

`;
  /** End of Text */
}
