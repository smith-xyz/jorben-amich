import { TestMemoryDatabase } from '@shared/test-utils';
import { getSummaContraGentilesEntites } from '@models';
import { SummaContraGentilesBookBuilder } from './SummaContraGentilesBookBuilder';

const testDb: TestMemoryDatabase = new TestMemoryDatabase({
  entities: getSummaContraGentilesEntites(),
});

let builder: SummaContraGentilesBookBuilder;

describe('SummaContraGentilesBookBuilder', () => {
  beforeAll(async () => {
    await testDb.setupTestDB();

    builder = new SummaContraGentilesBookBuilder({
      rawData: getTestHtml(),
      em: testDb.source.manager,
      bookName: 'God',
      bookNumber: 1,
      chaptersMixedTitles: false,
    });
  });

  afterAll(async () => {
    await testDb.teardownTestDB();
  });

  it('will build initial book object and add the list of chapters', () => {
    builder.book;
    expect(builder.book.name).toEqual('God');
    builder.buildChapters();
    expect(builder.book.chapters.length).toEqual(4);
    expect(builder.book.chapters[0].chapterNumber).toEqual(1);
    expect(builder.book.chapters[0].title).toEqual(
      'The office of the wise man'
    );
    expect(builder.book.chapters[1].chapterNumber).toEqual(2);
    expect(builder.book.chapters[1].title).toEqual(
      "The author's intention in the present work"
    );
    expect(builder.book.chapters[2].chapterNumber).toEqual(3);
    expect(builder.book.chapters[2].title).toEqual(
      'On the way in which divine truth is to be made known'
    );
    expect(builder.book.chapters[3].chapterNumber).toEqual(4);
    expect(builder.book.chapters[3].title).toEqual('Continued');
  });

  it('will build the list of paragraphs with opening chapter verses if available and add the latin chapter title for each chapter', () => {
    builder.buildParagraphs();
    expect(builder.book.chapters[0].latinOpeningVerse).toEqual(
      'Veritatem meditabitur guttur meum, et labia mea detestabuntur impium. Prov. 8-7.'
    );
    expect(builder.book.chapters[0].openingVerse).toEqual(
      '“My mouth shall meditate truth, and my lips shall hate impiety” (Prov. 8:7).'
    );
    expect(builder.book.chapters[0].latinTitle).toEqual(
      'Quod sit officium sapientis'
    );
    expect(builder.book.chapters[1].latinTitle).toEqual(
      'Quae sit in hoc opere auctoris intentio'
    );
    expect(builder.book.chapters[2].latinTitle).toEqual(
      'Quis modus sit possibilis divinae veritatis manifestandae'
    );
    expect(builder.book.chapters[3].latinTitle).toBeNull();

    expect(builder.book.chapters[0].paragraphs.length).toEqual(4);
    for (const paragraph of builder.book.chapters[0].paragraphs) {
      expect(paragraph.content).toBeDefined();
      expect(paragraph.content.length).toBeGreaterThan(0);

      expect(paragraph.latinParagraph).toBeDefined();
      expect(paragraph.latinParagraph.content).toBeDefined();
      expect(paragraph.latinParagraph.content.length).toBeGreaterThan(0);
      expect(/^\[(\d+)\]/.test(paragraph.content)).toEqual(false);
    }

    expect(builder.book.chapters[1].paragraphs.length).toEqual(4);
    for (const paragraph of builder.book.chapters[1].paragraphs) {
      expect(paragraph.content).toBeDefined();
      expect(paragraph.content.length).toBeGreaterThan(0);

      expect(paragraph.latinParagraph).toBeDefined();
      expect(paragraph.latinParagraph.content).toBeDefined();
      expect(paragraph.latinParagraph.content.length).toBeGreaterThan(0);
      expect(/^\[(\d+)\]/.test(paragraph.content)).toEqual(false);
    }

    expect(builder.book.chapters[2].paragraphs.length).toEqual(8);
    for (const paragraph of builder.book.chapters[2].paragraphs) {
      expect(paragraph.content).toBeDefined();
      expect(paragraph.content.length).toBeGreaterThan(0);

      expect(paragraph.latinParagraph).toBeDefined();
      expect(paragraph.latinParagraph.content).toBeDefined();
      expect(paragraph.latinParagraph.content.length).toBeGreaterThan(0);
      expect(/^\[(\d+)\]/.test(paragraph.content)).toEqual(false);
    }

    expect(builder.book.chapters[3].paragraphs.length).toEqual(2);
    // continued chapter, checking that paragraph numbers are retained
    expect(
      builder.book.chapters[3].paragraphs.map((p) => p.paragraphNumber)
    ).toEqual([9, 10]);
    for (const paragraph of builder.book.chapters[3].paragraphs) {
      expect(paragraph.content).toBeDefined();
      expect(paragraph.content.length).toBeGreaterThan(0);

      expect(paragraph.latinParagraph).toBeDefined();
      expect(paragraph.latinParagraph.content).toBeDefined();
      expect(paragraph.latinParagraph.content.length).toBeGreaterThan(0);
      expect(/^\[(\d+)\]/.test(paragraph.content)).toEqual(false);
    }
  });

  it('allows to setup a merging chapter', () => {
    // this merely will duplicate everything, but point is to make sure we are merging always
    builder.mergeContinuedChapter(getTestHtml());
    builder.buildChapters();
    builder.buildParagraphs();

    expect(builder.book.chapters.length).toEqual(8);

    // check that everything wasn't modified
    expect(builder.book.chapters[0].chapterNumber).toEqual(1);
    expect(builder.book.chapters[1].chapterNumber).toEqual(2);
    expect(builder.book.chapters[2].chapterNumber).toEqual(3);
    expect(builder.book.chapters[3].chapterNumber).toEqual(4);
    expect(builder.book.chapters[4].chapterNumber).toEqual(5);
    expect(builder.book.chapters[5].chapterNumber).toEqual(6);
    expect(builder.book.chapters[6].chapterNumber).toEqual(7);
    expect(builder.book.chapters[7].chapterNumber).toEqual(8);

    expect(builder.book.chapters[0].paragraphs.length).toEqual(4);
    expect(builder.book.chapters[1].paragraphs.length).toEqual(4);
    expect(builder.book.chapters[2].paragraphs.length).toEqual(8);
    expect(builder.book.chapters[3].paragraphs.length).toEqual(2);
    expect(builder.book.chapters[4].paragraphs.length).toEqual(4);
    expect(builder.book.chapters[5].paragraphs.length).toEqual(4);
    expect(builder.book.chapters[6].paragraphs.length).toEqual(8);
    expect(builder.book.chapters[7].paragraphs.length).toEqual(2);
  });

  it('handles when the chapters and chapter titles are in the same child element', () => {
    const builder = new SummaContraGentilesBookBuilder({
      rawData: getTestHtmlMixedChapterTitles(),
      em: testDb.source.manager,
      bookName: 'God',
      bookNumber: 1,
      chaptersMixedTitles: true,
    });
    builder.buildChapters();
    builder.buildParagraphs();
    expect(builder.book.chapters[0].latinOpeningVerse).toEqual(
      'Veritatem meditabitur guttur meum, et labia mea detestabuntur impium. Prov. 8-7.'
    );
    expect(builder.book.chapters[0].openingVerse).toEqual(
      '“My mouth shall meditate truth, and my lips shall hate impiety” (Prov. 8:7).'
    );
    expect(builder.book.chapters[0].latinTitle).toEqual(
      'Quod sit officium sapientis'
    );
    expect(builder.book.chapters[1].latinTitle).toEqual(
      'Quae sit in hoc opere auctoris intentio'
    );
  });
});

function getTestHtml() {
  return `<!DOCTYPE html>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Thomas Aquinas: Contra Gentiles: English</title>
  <body style="text-align=justify;font-family:Arial">
    <blockquote>
      <center>
        <h1>CONTRA GENTILES</h1>
        <h2>BOOK ONE: GOD</h2>
        <h3>translated by<br>
        Anton C. Pegis<br>
        <br>
        CONTENTS</h3>
      </center>
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <ol>
                <li>
                  <a href="ContraGentiles1.htm#1">The office of the wise man</a>
                <li>
                  <a href="ContraGentiles1.htm#2">The author's intention in the present work</a>
              </ol>
            <td valign="top">
              <ol>
                <li value="3">
                  <a href="ContraGentiles1.htm#3">On the way in which divine truth is to be made known</a>
                <li>
                  <a href="ContraGentiles1.htm#3">Continued</a>
              </ol>
      </table>
      <hr align="center">
      <table cellpadding="12">
        <tbody>
          <tr valign="top">
            <td style="text-align:center">
              <a name="1" id="1"><b>Caput 1</b></a>
            <td style="text-align:center"><b>Chapter 1</b>
          <tr valign="top">
            <td style="text-align:center"><b>Quod sit officium sapientis</b>
            <td style="text-align:center"><b>THE OFFICE OF THE WISE MAN</b>
          <tr valign="top">
            <td style="text-align:justify">Veritatem meditabitur guttur meum, et labia mea detestabuntur impium. Prov. 8-7.
            <td style="text-align:justify">“My mouth shall meditate truth, and my lips shall hate impiety” (Prov. 8:7).
          <tr valign="top">
            <td style="text-align:justify">Multitudinis usus, quem in rebus nominandis sequendum philosophus censet, communiter obtinuit ut sapientes dicantur qui res directe ordinant et eas bene gubernant. Unde inter alia quae homines de sapiente concipiunt, a philosopho ponitur quod sapientis est ordinare. Omnium autem ordinatorum ad finem, gubernationis et ordinis regulam ex fine sumi necesse est: tunc enim unaquaeque res optime disponitur cum ad suum finem convenienter ordinatur; finis enim est bonum uniuscuiusque. Unde videmus in artibus unam alterius esse gubernativam et quasi principem, ad quam pertinet eius finis: sicut medicinalis ars pigmentariae principatur et eam ordinat, propter hoc quod sanitas, circa quam medicinalis versatur, finis est omnium pigmentorum, quae arte pigmentaria conficiuntur. Et simile apparet in arte gubernatoria respectu navifactivae; et in militari respectu equestris et omnis bellici apparatus. Quae quidem artes aliis principantes architectonicae nominantur, quasi principales artes: unde et earum artifices, qui architectores vocantur, nomen sibi vindicant sapientum.<br>
            Quia vero praedicti artifices, singularium quarundam rerum fines pertractantes, ad finem universalem omnium non pertingunt, dicuntur quidem sapientes huius vel illius rei, secundum quem modum dicitur 1 Cor. 3-10, ut sapiens architectus, fundamentum posui; nomen autem simpliciter sapientis illi soli reservatur cuius consideratio circa finem universi versatur, qui item est universitatis principium; unde secundum philosophum, sapientis est causas altissimas considerare.
            <td style="text-align:justify">[1] The usage of the multitude, which according to the Philosopher is to be followed in giving names to things, has commonly held that they are to be called wise who order things rightly and govern them well. Hence, among other things that men have conceived about the wise man, the Philosopher includes the notion that “it belongs to the wise man to order.” Now, the rule of government and order for all things directed to an end must be taken from the end. For, since the end of each thing is its good, a thing is then best disposed when it is fittingly ordered to its end. And so we see among the arts that one functions as the governor and the ruler of another because it controls its end. Thus, the art of medicine rules and orders the art of the chemist because health, with which medicine is concerned, is the end of all the medications prepared by the art of the chemist. A similar situation obtains in the art of ship navigation in relation to shipbuilding, and in the military art with respect to the equestrian art and the equipment of war. The arts that rule other arts are called architectonic, as being the ruling arts. That is why the artisans devoted to these arts, who are called master artisans, appropriate to themselves the name of wise men.<br>
            But, since these artisans are concerned, in each case, with the ends of certain particular things, they do not reach to the universal end of all things. They are therefore said to be wise with respect to this or that thing; in which sense it is said that “as a wise architect, I have laid the foundation” (1 Cor. 3:10). The name of the absolutely wise man, however, is reserved for him whose consideration is directed to the end of the universe, which is also the origin of the universe. That is why, according to the Philosopher, it belongs to the wise man to consider the highest causes.
          <tr valign="top">
            <td style="text-align:justify">Finis autem ultimus uniuscuiusque rei est qui intenditur a primo auctore vel motore ipsius. Primus autem auctor et motor universi est intellectus, ut infra ostendetur. Oportet igitur ultimum finem universi esse bonum intellectus. Hoc autem est veritas. Oportet igitur veritatem esse ultimum finem totius universi; et circa eius considerationem principaliter sapientiam insistere. Et ideo ad veritatis manifestationem divina sapientia carne induta se venisse in mundum testatur, dicens, Ioan. 18-37: ego in hoc natus sum, et ad hoc veni in mundum, ut testimonium perhibeam veritati.<br>
            Sed et primam philosophiam philosophus determinat esse scientiam veritatis; non cuiuslibet, sed eius veritatis quae est origo omnis veritatis, scilicet quae pertinet ad primum principium essendi omnibus; unde et sua veritas est omnis veritatis principium; sic enim est dispositio rerum in veritate sicut in esse.
            <td style="text-align:justify">[2] Now, the end of each thing is that which is intended by its first author or mover. But the first author and mover of the universe is an intellect, as will be later shown. The ultimate end of the universe must, therefore, be the good of an intellect. This good is truth. Truth must consequently be the ultimate end of the whole universe, and the consideration of the wise man aims principally at truth. So it is that, according to His own statement, divine Wisdom testifies that He has assumed flesh and come into the world in order to make the truth known: “For this was I born, and for this came I into the world, that I should give testimony to the truth” (John 18:37).<br>
            The Philosopher himself establishes that first philosophy is the science of truth, not of any truth, but of that truth which is the origin of all truth, namely, which belongs to the first principle whereby all things are. The truth belonging to such a principle is, clearly, the source of all truth; for things have the same disposition in truth as in being.
          <tr valign="top">
            <td style="text-align:justify">Eiusdem autem est unum contrariorum prosequi et aliud refutare sicut medicina, quae sanitatem operatur, aegritudinem excludit. Unde sicut sapientis est veritatem praecipue de primo principio meditari et aliis disserere, ita eius est falsitatem contrariam impugnare.
            <td style="text-align:justify">[3] It belongs to one and the same science, however, both to pursue one of two contraries and to oppose the other. Medicine, for example, seeks to effect health and to eliminate illness. Hence, just as it belongs to the wise man to meditate especially on the truth belonging to the first principle and to teach it to others, so it belongs to him to refute the opposing falsehood.
          <tr valign="top">
            <td style="text-align:justify">Convenienter ergo ex ore sapientiae duplex sapientis officium in verbis propositis demonstratur: scilicet veritatem divinam, quae antonomastice est veritas, meditatam eloqui, quod tangit cum dicit, veritatem meditabitur guttur meum; et errorem contra veritatem impugnare, quod tangit cum dicit, et labia mea detestabuntur impium, per quod falsitas contra divinam veritatem designatur, quae religioni contraria est, quae etiam pietas nominatur, unde et falsitas contraria ei impietatis sibi nomen assumit.
            <td style="text-align:justify">[4] Appropriately, therefore, is the twofold office of the wise man shown from the mouth of Wisdom in our opening words: to meditate and speak forth of the divine truth, which is truth in person (Wisdom touches on this in the words my mouth shall meditate truth), and to refute the opposing error (which Wisdom touches on in the words and my lips shall hate impiety). By impiety is here meant falsehood against the divine truth. This falsehood is contrary to religion, which is likewise named piety. Hence, the falsehood contrary to it is called impiety.
      </table>
      <hr>
      <table cellpadding="12">
        <tbody>
          <tr valign="top">
            <td style="text-align:center">
              <a name="1" id="1"><b>Caput 2</b></a>
            <td style="text-align:center"><b>Chapter 2</b>
          <tr valign="top">
            <td style="text-align:center"><b>Quae sit in hoc opere auctoris intentio</b>
            <td style="text-align:center"><b>THE AUTHOR'S INTENTION IN THE PRESENT WORK</b>
          <tr valign="top">
            <td style="text-align:justify">Inter omnia vero hominum studia sapientiae studium est perfectius, sublimius, utilius et iucundius.
            <td style="text-align:justify">[1] Among all human pursuits, the pursuit of wisdom is more perfect, more noble, more useful, and more full of joy.
          <tr valign="top">
            <td style="text-align:justify">Perfectius quidem, quia inquantum homo sapientiae studium dat, intantum verae beatitudinis iam aliquam partem habet unde sapiens dicit, beatus vir qui in sapientia morabitur, Eccli. 14-22.
            <td style="text-align:justify">It is more perfect because, in so far as a man gives himself to the pursuit of wisdom, so far does he even now have some share in true beatitude. And so a wise man has said: “Blessed is the man that shall continue in wisdom” (Sirach 14:22).
          <tr valign="top">
            <td style="text-align:justify">Sublimius autem est quia per ipsum homo praecipue ad divinam similitudinem accedit, quae omnia in sapientia fecit: unde, quia similitudo causa est dilectionis, sapientiae studium praecipue Deo per amicitiam coniungit; propter quod Sap. 7-14 dicitur quod sapientia infinitus thesaurus est hominibus, quo qui usi sunt, facti sunt participes amicitiae Dei.
            <td style="text-align:justify">It is more noble because through this pursuit man especially approaches to a likeness to God Who “made all things in wisdom” (Ps. 103:24). And since likeness is the cause of love, the pursuit of wisdom especially joins man to God in friendship. That is why it is said of wisdom that “she is an infinite treasure to men! which they that use become the friends of God” (Wis. 7:14).
          <tr valign="top">
            <td style="text-align:justify">Utilius autem est quia per ipsam sapientiam ad immortalitatis regnum pervenitur: concupiscentia enim sapientiae deducet ad regnum perpetuum, Sap. 6-21.
            <td style="text-align:justify">It is more useful because through wisdom we arrive at the kingdom of immortality. For “the desire of wisdom leads to the everlasting kingdom” (Wis. 6:21).
          <tr valign="top">
            <td style="text-align:justify">Iucundius autem est quia non habet amaritudinem conversatio illius nec taedium convictus illius, sed laetitiam et gaudium, Sap. 8-16.
            <td style="text-align:justify">It is more full of joy because “her conversation has no bitterness, nor her company any tediousness, but joy and gladness” (Wis. 7:16).
          <tr valign="top">
            <td style="text-align:justify">Assumpta igitur ex divina pietate fiducia sapientis officium prosequendi, quamvis proprias vires excedat, propositum nostrae intentionis est veritatem quam fides Catholica profitetur, pro nostro modulo manifestare, errores eliminando contrarios: ut enim verbis Hilarii utar, ego hoc vel praecipuum vitae meae officium debere me Deo conscius sum, ut eum omnis sermo meus et sensus loquatur.
            <td style="text-align:justify">[2] And so, in the name of the divine Mercy, I have the confidence to embark upon the work of a wise man, even though this may surpass my powers, and I have set myself the task of making known, as far as my limited powers will allow, the truth that the Catholic faith professes, and of setting aside the errors that are opposed to it. To use the words of Hilary: “I am aware that I owe this to God as the chief duty of my life, that my every word and sense may speak of Him” [ <i>De Trinitate</i> I, 37].
          <tr valign="top">
            <td style="text-align:justify">Contra singulorum autem errores difficile est procedere, propter duo. Primo, quia non ita sunt nobis nota singulorum errantium dicta sacrilega ut ex his quae dicunt possimus rationes assumere ad eorum errores destruendos. Hoc enim modo usi sunt antiqui doctores in destructionem errorum gentilium quorum positiones scire poterant quia et ipsi gentiles fuerant, vel saltem inter gentiles conversati et in eorum doctrinis eruditi.<br>
            Secundo, quia quidam eorum, ut Mahumetistae et Pagani, non conveniunt nobiscum in auctoritate alicuius Scripturae, per quam possint convinci, sicut contra Iudaeos disputare possumus per vetus testamentum, contra haereticos per novum. Hi vero neutrum recipiunt. Unde necesse est ad naturalem rationem recurrere, cui omnes assentire coguntur. Quae tamen in rebus divinis deficiens est.
            <td style="text-align:justify">[3] To proceed against individual errors, however, is a difficult business, and this for two reasons. In the first place, it is difficult because the sacrilegious remarks of individual men who have erred are not so well known to us so that we may use what they say as the basis of proceeding to a refutation of their errors. This is, indeed, the method that the ancient Doctors of the Church used in the refutation of the errors of the Gentiles. For they could know the positions taken by the Gentiles since they themselves had been Gentiles, or at least had lived among the Gentiles and had been instructed in their teaching.<br>
            In the second place, it is difficult because some of them, such as the Mohammedans and the pagans, do not agree with us in accepting the authority of any Scripture, by which they may be convinced of their error. Thus, against the Jews we are able to argue by means of the Old Testament, while against heretics we are able to argue by means of the New Testament. But the Muslims and the pagans accept neither the one nor the other. We must, therefore, have recourse to the natural reason, to which all men are forced to give their assent. However, it is true, in divine matters the natural reason has its failings.
          <tr valign="top">
            <td style="text-align:justify">Simul autem veritatem aliquam investigantes ostendemus qui errores per eam excludantur: et quomodo demonstrativa veritas, fidei Christianae religionis concordet.
            <td style="text-align:justify">[4] Now, while we are investigating some given truth, we shall also show what errors are set aside by it; and we shall likewise show how the truth that we come to know by demonstration is in accord with the Christian religion.
      </table>
      <hr>
      <table cellpadding="12">
        <tbody>
          <tr valign="top">
            <td style="text-align:center">
              <a name="3" id="3"><b>Caput 3</b></a>
            <td style="text-align:center"><b>Chapter 3</b>
          <tr valign="top">
            <td style="text-align:center"><b>Quis modus sit possibilis divinae veritatis manifestandae</b>
            <td style="text-align:center"><b>ON THE WAY IN WHICH DIVINE TRUTH<br>
            IS TO BE MADE KNOWN</b>
          <tr valign="top">
            <td style="text-align:justify">Quia vero non omnis veritatis manifestandae modus est idem; disciplinati autem hominis est tantum de unoquoque fidem capere tentare, quantum natura rei permittit, ut a philosopho, optime dictum Boetius introducit, necesse est prius ostendere quis modus sit possibilis ad veritatem propositam manifestandam.
            <td style="text-align:justify">[1] The way of making truth known is not always the same, and, as the Philosopher has very well said, “it belongs to an educated man to seek such certitude in each thing as the nature of that thing allows.” The remark is also introduced by Boethius [ <i>De Trinitate</i> II]. But, since such is the case, we must first show what way is open to us in order that we may make known the truth which is our object.
          <tr valign="top">
            <td style="text-align:justify">Est autem in his quae de Deo confitemur duplex veritatis modus. Quaedam namque vera sunt de Deo quae omnem facultatem humanae rationis excedunt, ut Deum esse trinum et unum. Quaedam vero sunt ad quae etiam ratio naturalis pertingere potest, sicut est Deum esse, Deum esse unum, et alia huiusmodi; quae etiam philosophi demonstrative de Deo probaverunt, ducti naturalis lumine rationis.
            <td style="text-align:justify">[2] There is a twofold mode of truth in what we profess about God. Some truths about God exceed all the ability of the human reason. Such is the truth that God is triune. But there are some truths which the natural reason also is able to reach. Such are that God exists, that He is one, and the like. In fact, such truths about God have been proved demonstratively by the philosophers, guided by the light of the natural reason.
          <tr valign="top">
            <td style="text-align:justify">Quod autem sint aliqua intelligibilium divinorum quae humanae rationis penitus excedant ingenium, evidentissime apparet.<br>
            Cum enim principium totius scientiae quam de aliqua re ratio percipit, sit intellectus substantiae ipsius, eo quod, secundum doctrinam philosophi demonstrationis principium est quod quid est; oportet quod secundum modum quo substantia rei intelligitur, sit modus eorum quae de re illa cognoscuntur. Unde si intellectus humanus, alicuius rei substantiam comprehendit, puta lapidis vel trianguli, nullum intelligibilium illius rei facultatem humanae rationis excedet. Quod quidem nobis circa Deum non accidit. Nam ad substantiam ipsius capiendam intellectus humanus naturali virtute pertingere non potest: cum intellectus nostri, secundum modum praesentis vitae, cognitio a sensu incipiat; et ideo ea quae in sensu non cadunt, non possunt humano intellectu capi, nisi quatenus ex sensibilibus earum cognitio colligitur. Sensibilia autem ad hoc ducere intellectum nostrum non possunt ut in eis divina substantia videatur quid sit: cum sint effectus causae virtutem non aequantes. Ducitur tamen ex sensibilibus intellectus noster in divinam cognitionem ut cognoscat de Deo quia est, et alia huiusmodi quae oportet attribui primo principio. Sunt igitur quaedam intelligibilium divinorum quae humanae rationi sunt pervia; quaedam vero quae omnino vim humanae rationis excedunt.
            <td style="text-align:justify">[3] That there are certain truths about God that totally surpass man’s ability appears with the greatest evidence.<br>
            Since, indeed, the principle of all knowledge that the reason perceives about some thing is the understanding of the very substance of that being (for according to Aristotle “what a thing is” is the principle of demonstration) [ <i>Posterior Analytics</i> II, 3], it is necessary that the way in which we understand the substance of a thing determines the way in which we know what belongs to it. Hence, if the human intellect comprehends the substance of some thing, for example, that of a stone or of a triangle, no intelligible characteristic belonging to that thing surpasses the grasp of the human reason. But this does not happen to us in the case of God. For the human intellect is not able to reach a comprehension of the divine substance through its natural power. For, according to its manner of knowing in the present life, the intellect depends on the sense for the origin of knowledge; and so those things that do not fall under the senses cannot be grasped by the human intellect except in so far as the knowledge of them is gathered from sensible things. Now, sensible things cannot lead the human intellect to the point of seeing in them the nature of the divine substance; for sensible things are effects that fall short of the power of their cause. Yet, beginning with sensible things, our intellect is led to the point of knowing about God that He exists, and other such characteristics that must be attributed to the First Principle. There are, consequently, some intelligible truths about God that are open to the human reason; but there are others that absolutely surpass its power.
          <tr valign="top">
            <td style="text-align:justify">Adhuc ex intellectuum gradibus idem facile est videre. Duorum enim quorum unus alio rem aliquam intellectu subtilius intuetur, ille cuius intellectus est elevatior, multa intelligit quae alius omnino capere non potest: sicut patet in rustico, qui nullo modo philosophiae subtiles considerationes capere potest. Intellectus autem Angeli plus excedit intellectum humanum quam intellectus optimi philosophi intellectum rudissimi idiotae: quia haec distantia inter speciei humanae limites continetur, quos angelicus intellectus excedit. Cognoscit quidem Angelus Deum ex nobiliori effectu quam homo: quanto ipsa substantia Angeli, per quam in Dei cognitionem ducitur naturali cognitione, est dignior rebus sensibilibus et etiam ipsa anima, per quam intellectus humanus in Dei cognitionem ascendit. Multoque amplius intellectus divinus excedit angelicum quam angelicus humanum. Ipse enim intellectus divinus sua capacitate substantiam suam adaequat, et ideo perfecte de se intelligit quid est, et omnia cognoscit quae de ipso intelligibilia sunt: non autem naturali cognitione Angelus de Deo cognoscit quid est, quia et ipsa substantia Angeli, per quam in Dei cognitionem ducitur, est effectus causae virtutem non adaequans. Unde non omnia quae in seipso Deus intelligit, Angelus naturali cognitione capere potest: nec ad omnia quae Angelus sua naturali virtute intelligit, humana ratio sufficit capienda. Sicut igitur maximae amentiae esset idiota qui ea quae a philosopho proponuntur falsa esse assereret propter hoc quod ea capere non potest, ita, et multo amplius, nimiae stultitiae est homo si ea quae divinitus Angelorum ministerio revelantur falsa esse suspicatur ex hoc quod ratione investigari non possunt.
            <td style="text-align:justify">[4] We may easily see the same point from the gradation of intellects. Consider the case of two persons of whom one has a more penetrating grasp of a thing by his intellect than, does the other. He who has the superior intellect understands many things that the other cannot grasp at all. Such is the case with a very simple person who cannot at all grasp the subtle speculations of philosophy. But the intellect of an angel surpasses the human intellect much more than the intellect of the greatest philosopher surpasses the intellect of the most uncultivated simple person; for the distance between the best philosopher and a simple person is contained within the limits of the human species, which the angelic intellect surpasses. For the angel knows God on the basis of a more noble effect than does man; and this by as much as the substance of an angel, through which the angel in his natural knowledge is led to the knowledge of God, is nobler than sensible things and even than the soul itself, through which the human intellect mounts to the knowledge of God. The divine intellect surpasses the angelic intellect much more than the angelic surpasses the human. For the divine intellect is in its capacity equal to its substance, and therefore it understands fully what it is, including all its intelligible attributes. But by his natural knowledge the angel does not know what God is, since the substance itself of the angel, through which he is led to the knowledge of God, is an effect that is not equal to the power of its cause. Hence, the angel is not able, by means of his natural knowledge, to grasp all the things that God understands in Himself; nor is the human reason sufficient to grasp all the things that the angel understands through his own natural power. Just as, therefore, it would he the height of folly for a simple person to assert that what a philosopher proposes is false on the ground that he himself cannot understand it, so (and even more so) it is the acme of stupidity for a man to suspect as false what is divinely revealed through the ministry of the angels simply because it cannot be investigated by reason.
          <tr valign="top">
            <td style="text-align:justify">Adhuc idem manifeste apparet ex defectu quem in rebus cognoscendis quotidie experimur. Rerum enim sensibilium plurimas proprietates ignoramus, earumque proprietatum quas sensu apprehendimus rationes perfecte in pluribus invenire non possumus. Multo igitur amplius illius excellentissimae substantiae omnia intelligibilia humana ratio investigare non sufficit.
            <td style="text-align:justify">[5] The same thing, moreover, appears quite clearly from the defect that we experience every day in our knowledge of things. We do not know a great many of the properties of sensible things, and in most cases we are not able to discover fully the natures of those properties that we apprehend by the sense. Much more is it the case, therefore, that the human reason is not equal to the task of investigating all the intelligible characteristics of that most excellent substance.
          <tr valign="top">
            <td style="text-align:justify">Huic etiam consonat dictum philosophi, qui in II Metaphys. asserit quod intellectus noster se habet ad prima entium, quae sunt manifestissima in natura, sicut oculus vespertilionis ad solem.
            <td style="text-align:justify">[6] The remark of Aristotle likewise agrees with this conclusion. He says that “our intellect is related to the prime beings, which are most evident in their nature, as the eye of an owl is related to the sun” [ <i>Metaphysics</i> Ia, 1]
          <tr valign="top">
            <td style="text-align:justify">Huic etiam veritati sacra Scriptura testimonium perhibet. Dicitur enim Iob 11-7: forsitan vestigia Dei comprehendes, et omnipotentem usque ad perfectum reperies? Et 36-26: ecce, Deus magnus, vincens scientiam nostram. Et 1 Cor. 13-9: ex parte cognoscimus.
            <td style="text-align:justify">[7] Sacred Scripture also gives testimony to this truth. We read in Job: “Do you think you can comprehend the depths of God, and find the limit of the Almighty?” (11:7). And again: “Behold, God is great, exceeding our knowledge” (Job 36:26). And St. Paul: “We know in part” (1 Cor. 13:9).
          <tr valign="top">
            <td style="text-align:justify">Non igitur omne quod de Deo dicitur, quamvis ratione investigari non possit, statim quasi falsum abiiciendum est, ut Manichaei et plures infidelium putaverunt.
            <td style="text-align:justify">[8] We should not, therefore, immediately reject as false, following the opinion of the Manicheans and many unbelievers, everything that is said about God even though it cannot be investigated by reason.
      </table>
      <hr>
      <table cellpadding="12">
      <tbody>
        <tr valign="top">
          <td style="text-align:center">
            <a name="3" id="3"><b>Caput 4</b></a>
          <td style="text-align:center"><b>Chapter 4</b>
        <tr valign="top">
          <td style="text-align:center">
          <td style="text-align:center"><b>Continued</b>
        <tr valign="top">
          <td style="text-align:justify">Quia vero non omnis veritatis manifestandae modus est idem; disciplinati autem hominis est tantum de unoquoque fidem capere tentare, quantum natura rei permittit, ut a philosopho, optime dictum Boetius introducit, necesse est prius ostendere quis modus sit possibilis ad veritatem propositam manifestandam.
          <td style="text-align:justify">[9] The way of making truth known is not always the same, and, as the Philosopher has very well said, “it belongs to an educated man to seek such certitude in each thing as the nature of that thing allows.” The remark is also introduced by Boethius [ <i>De Trinitate</i> II]. But, since such is the case, we must first show what way is open to us in order that we may make known the truth which is our object.
        <tr valign="top">
          <td style="text-align:justify">Est autem in his quae de Deo confitemur duplex veritatis modus. Quaedam namque vera sunt de Deo quae omnem facultatem humanae rationis excedunt, ut Deum esse trinum et unum. Quaedam vero sunt ad quae etiam ratio naturalis pertingere potest, sicut est Deum esse, Deum esse unum, et alia huiusmodi; quae etiam philosophi demonstrative de Deo probaverunt, ducti naturalis lumine rationis.
          <td style="text-align:justify">[10] There is a twofold mode of truth in what we profess about God. Some truths about God exceed all the ability of the human reason. Such is the truth that God is triune. But there are some truths which the natural reason also is able to reach. Such are that God exists, that He is one, and the like. In fact, such truths about God have been proved demonstratively by the philosophers, guided by the light of the natural reason.
    </table>
    <hr>
    </blockquote>
    <script type="text/javascript" src="/navbar.js"></script>`;
}

function getTestHtmlMixedChapterTitles() {
  return `<!DOCTYPE html>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Thomas Aquinas: Contra Gentiles: English</title>
  <body style="text-align=justify;font-family:Arial">
    <blockquote>
      <center>
        <h1>CONTRA GENTILES</h1>
        <h2>BOOK ONE: GOD</h2>
        <h3>translated by<br>
        Anton C. Pegis<br>
        <br>
        CONTENTS</h3>
      </center>
      <table>
        <tbody>
          <tr>
            <td valign="top">
              <ol>
                <li>
                  <a href="ContraGentiles1.htm#1">The office of the wise man</a>
                <li>
                  <a href="ContraGentiles1.htm#2">The author's intention in the present work</a>
              </ol>
      </table>
      <hr align="center">
      <table cellpadding="12">
        <tbody>
          <tr valign="top">
            <td align="center"><b>Caput 1<br>
            Quod sit officium sapientis</b>
            <td align="center"><b>Chapter 1<br>
            The office of the wise man</b>
          <tr valign="top">
            <td style="text-align:justify">Veritatem meditabitur guttur meum, et labia mea detestabuntur impium. Prov. 8-7.
            <td style="text-align:justify">“My mouth shall meditate truth, and my lips shall hate impiety” (Prov. 8:7).
          <tr valign="top">
            <td style="text-align:justify">Multitudinis usus, quem in rebus nominandis sequendum philosophus censet, communiter obtinuit ut sapientes dicantur qui res directe ordinant et eas bene gubernant. Unde inter alia quae homines de sapiente concipiunt, a philosopho ponitur quod sapientis est ordinare. Omnium autem ordinatorum ad finem, gubernationis et ordinis regulam ex fine sumi necesse est: tunc enim unaquaeque res optime disponitur cum ad suum finem convenienter ordinatur; finis enim est bonum uniuscuiusque. Unde videmus in artibus unam alterius esse gubernativam et quasi principem, ad quam pertinet eius finis: sicut medicinalis ars pigmentariae principatur et eam ordinat, propter hoc quod sanitas, circa quam medicinalis versatur, finis est omnium pigmentorum, quae arte pigmentaria conficiuntur. Et simile apparet in arte gubernatoria respectu navifactivae; et in militari respectu equestris et omnis bellici apparatus. Quae quidem artes aliis principantes architectonicae nominantur, quasi principales artes: unde et earum artifices, qui architectores vocantur, nomen sibi vindicant sapientum.<br>
            Quia vero praedicti artifices, singularium quarundam rerum fines pertractantes, ad finem universalem omnium non pertingunt, dicuntur quidem sapientes huius vel illius rei, secundum quem modum dicitur 1 Cor. 3-10, ut sapiens architectus, fundamentum posui; nomen autem simpliciter sapientis illi soli reservatur cuius consideratio circa finem universi versatur, qui item est universitatis principium; unde secundum philosophum, sapientis est causas altissimas considerare.
            <td style="text-align:justify">[1] The usage of the multitude, which according to the Philosopher is to be followed in giving names to things, has commonly held that they are to be called wise who order things rightly and govern them well. Hence, among other things that men have conceived about the wise man, the Philosopher includes the notion that “it belongs to the wise man to order.” Now, the rule of government and order for all things directed to an end must be taken from the end. For, since the end of each thing is its good, a thing is then best disposed when it is fittingly ordered to its end. And so we see among the arts that one functions as the governor and the ruler of another because it controls its end. Thus, the art of medicine rules and orders the art of the chemist because health, with which medicine is concerned, is the end of all the medications prepared by the art of the chemist. A similar situation obtains in the art of ship navigation in relation to shipbuilding, and in the military art with respect to the equestrian art and the equipment of war. The arts that rule other arts are called architectonic, as being the ruling arts. That is why the artisans devoted to these arts, who are called master artisans, appropriate to themselves the name of wise men.<br>
            But, since these artisans are concerned, in each case, with the ends of certain particular things, they do not reach to the universal end of all things. They are therefore said to be wise with respect to this or that thing; in which sense it is said that “as a wise architect, I have laid the foundation” (1 Cor. 3:10). The name of the absolutely wise man, however, is reserved for him whose consideration is directed to the end of the universe, which is also the origin of the universe. That is why, according to the Philosopher, it belongs to the wise man to consider the highest causes.
          <tr valign="top">
            <td style="text-align:justify">Finis autem ultimus uniuscuiusque rei est qui intenditur a primo auctore vel motore ipsius. Primus autem auctor et motor universi est intellectus, ut infra ostendetur. Oportet igitur ultimum finem universi esse bonum intellectus. Hoc autem est veritas. Oportet igitur veritatem esse ultimum finem totius universi; et circa eius considerationem principaliter sapientiam insistere. Et ideo ad veritatis manifestationem divina sapientia carne induta se venisse in mundum testatur, dicens, Ioan. 18-37: ego in hoc natus sum, et ad hoc veni in mundum, ut testimonium perhibeam veritati.<br>
            Sed et primam philosophiam philosophus determinat esse scientiam veritatis; non cuiuslibet, sed eius veritatis quae est origo omnis veritatis, scilicet quae pertinet ad primum principium essendi omnibus; unde et sua veritas est omnis veritatis principium; sic enim est dispositio rerum in veritate sicut in esse.
            <td style="text-align:justify">[2] Now, the end of each thing is that which is intended by its first author or mover. But the first author and mover of the universe is an intellect, as will be later shown. The ultimate end of the universe must, therefore, be the good of an intellect. This good is truth. Truth must consequently be the ultimate end of the whole universe, and the consideration of the wise man aims principally at truth. So it is that, according to His own statement, divine Wisdom testifies that He has assumed flesh and come into the world in order to make the truth known: “For this was I born, and for this came I into the world, that I should give testimony to the truth” (John 18:37).<br>
            The Philosopher himself establishes that first philosophy is the science of truth, not of any truth, but of that truth which is the origin of all truth, namely, which belongs to the first principle whereby all things are. The truth belonging to such a principle is, clearly, the source of all truth; for things have the same disposition in truth as in being.
          <tr valign="top">
            <td style="text-align:justify">Eiusdem autem est unum contrariorum prosequi et aliud refutare sicut medicina, quae sanitatem operatur, aegritudinem excludit. Unde sicut sapientis est veritatem praecipue de primo principio meditari et aliis disserere, ita eius est falsitatem contrariam impugnare.
            <td style="text-align:justify">[3] It belongs to one and the same science, however, both to pursue one of two contraries and to oppose the other. Medicine, for example, seeks to effect health and to eliminate illness. Hence, just as it belongs to the wise man to meditate especially on the truth belonging to the first principle and to teach it to others, so it belongs to him to refute the opposing falsehood.
          <tr valign="top">
            <td style="text-align:justify">Convenienter ergo ex ore sapientiae duplex sapientis officium in verbis propositis demonstratur: scilicet veritatem divinam, quae antonomastice est veritas, meditatam eloqui, quod tangit cum dicit, veritatem meditabitur guttur meum; et errorem contra veritatem impugnare, quod tangit cum dicit, et labia mea detestabuntur impium, per quod falsitas contra divinam veritatem designatur, quae religioni contraria est, quae etiam pietas nominatur, unde et falsitas contraria ei impietatis sibi nomen assumit.
            <td style="text-align:justify">[4] Appropriately, therefore, is the twofold office of the wise man shown from the mouth of Wisdom in our opening words: to meditate and speak forth of the divine truth, which is truth in person (Wisdom touches on this in the words my mouth shall meditate truth), and to refute the opposing error (which Wisdom touches on in the words and my lips shall hate impiety). By impiety is here meant falsehood against the divine truth. This falsehood is contrary to religion, which is likewise named piety. Hence, the falsehood contrary to it is called impiety.
      </table>
      <hr>
      <table cellpadding="12">
        <tbody>
          <tr valign="top">
            <td align="center"><b>Caput 2<br>
            Quae sit in hoc opere auctoris intentio</b>
            <td align="center"><b>Chapter 2<br>
            THE AUTHOR'S INTENTION IN THE PRESENT WORK</b>
          <tr valign="top">
            <td style="text-align:justify">Inter omnia vero hominum studia sapientiae studium est perfectius, sublimius, utilius et iucundius.
            <td style="text-align:justify">[1] Among all human pursuits, the pursuit of wisdom is more perfect, more noble, more useful, and more full of joy.
          <tr valign="top">
            <td style="text-align:justify">Perfectius quidem, quia inquantum homo sapientiae studium dat, intantum verae beatitudinis iam aliquam partem habet unde sapiens dicit, beatus vir qui in sapientia morabitur, Eccli. 14-22.
            <td style="text-align:justify">It is more perfect because, in so far as a man gives himself to the pursuit of wisdom, so far does he even now have some share in true beatitude. And so a wise man has said: “Blessed is the man that shall continue in wisdom” (Sirach 14:22).
          <tr valign="top">
            <td style="text-align:justify">Sublimius autem est quia per ipsum homo praecipue ad divinam similitudinem accedit, quae omnia in sapientia fecit: unde, quia similitudo causa est dilectionis, sapientiae studium praecipue Deo per amicitiam coniungit; propter quod Sap. 7-14 dicitur quod sapientia infinitus thesaurus est hominibus, quo qui usi sunt, facti sunt participes amicitiae Dei.
            <td style="text-align:justify">It is more noble because through this pursuit man especially approaches to a likeness to God Who “made all things in wisdom” (Ps. 103:24). And since likeness is the cause of love, the pursuit of wisdom especially joins man to God in friendship. That is why it is said of wisdom that “she is an infinite treasure to men! which they that use become the friends of God” (Wis. 7:14).
          <tr valign="top">
            <td style="text-align:justify">Utilius autem est quia per ipsam sapientiam ad immortalitatis regnum pervenitur: concupiscentia enim sapientiae deducet ad regnum perpetuum, Sap. 6-21.
            <td style="text-align:justify">It is more useful because through wisdom we arrive at the kingdom of immortality. For “the desire of wisdom leads to the everlasting kingdom” (Wis. 6:21).
          <tr valign="top">
            <td style="text-align:justify">Iucundius autem est quia non habet amaritudinem conversatio illius nec taedium convictus illius, sed laetitiam et gaudium, Sap. 8-16.
            <td style="text-align:justify">It is more full of joy because “her conversation has no bitterness, nor her company any tediousness, but joy and gladness” (Wis. 7:16).
          <tr valign="top">
            <td style="text-align:justify">Assumpta igitur ex divina pietate fiducia sapientis officium prosequendi, quamvis proprias vires excedat, propositum nostrae intentionis est veritatem quam fides Catholica profitetur, pro nostro modulo manifestare, errores eliminando contrarios: ut enim verbis Hilarii utar, ego hoc vel praecipuum vitae meae officium debere me Deo conscius sum, ut eum omnis sermo meus et sensus loquatur.
            <td style="text-align:justify">[2] And so, in the name of the divine Mercy, I have the confidence to embark upon the work of a wise man, even though this may surpass my powers, and I have set myself the task of making known, as far as my limited powers will allow, the truth that the Catholic faith professes, and of setting aside the errors that are opposed to it. To use the words of Hilary: “I am aware that I owe this to God as the chief duty of my life, that my every word and sense may speak of Him” [ <i>De Trinitate</i> I, 37].
          <tr valign="top">
            <td style="text-align:justify">Contra singulorum autem errores difficile est procedere, propter duo. Primo, quia non ita sunt nobis nota singulorum errantium dicta sacrilega ut ex his quae dicunt possimus rationes assumere ad eorum errores destruendos. Hoc enim modo usi sunt antiqui doctores in destructionem errorum gentilium quorum positiones scire poterant quia et ipsi gentiles fuerant, vel saltem inter gentiles conversati et in eorum doctrinis eruditi.<br>
            Secundo, quia quidam eorum, ut Mahumetistae et Pagani, non conveniunt nobiscum in auctoritate alicuius Scripturae, per quam possint convinci, sicut contra Iudaeos disputare possumus per vetus testamentum, contra haereticos per novum. Hi vero neutrum recipiunt. Unde necesse est ad naturalem rationem recurrere, cui omnes assentire coguntur. Quae tamen in rebus divinis deficiens est.
            <td style="text-align:justify">[3] To proceed against individual errors, however, is a difficult business, and this for two reasons. In the first place, it is difficult because the sacrilegious remarks of individual men who have erred are not so well known to us so that we may use what they say as the basis of proceeding to a refutation of their errors. This is, indeed, the method that the ancient Doctors of the Church used in the refutation of the errors of the Gentiles. For they could know the positions taken by the Gentiles since they themselves had been Gentiles, or at least had lived among the Gentiles and had been instructed in their teaching.<br>
            In the second place, it is difficult because some of them, such as the Mohammedans and the pagans, do not agree with us in accepting the authority of any Scripture, by which they may be convinced of their error. Thus, against the Jews we are able to argue by means of the Old Testament, while against heretics we are able to argue by means of the New Testament. But the Muslims and the pagans accept neither the one nor the other. We must, therefore, have recourse to the natural reason, to which all men are forced to give their assent. However, it is true, in divine matters the natural reason has its failings.
          <tr valign="top">
            <td style="text-align:justify">Simul autem veritatem aliquam investigantes ostendemus qui errores per eam excludantur: et quomodo demonstrativa veritas, fidei Christianae religionis concordet.
            <td style="text-align:justify">[4] Now, while we are investigating some given truth, we shall also show what errors are set aside by it; and we shall likewise show how the truth that we come to know by demonstration is in accord with the Christian religion.
      </table>
    <hr>
    </blockquote>
    <script type="text/javascript" src="/navbar.js"></script>`;
}
