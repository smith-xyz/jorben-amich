import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { helpSlashCommand } from '../slash-command-config';
import { createStandardReply } from '../tools';

const helpDescription = `

__Slash Commands:__

/st - fetch specified entry from _summa theologica_
/scg - fetch specified entry from _summa contra gentiles_, latin available
/search - search for entries by keywords
/settings - configure settings

__Message Events:__

If message events are set to on and when a message begins with one of following, aquinas bot will attempt to provide the feedback:

summa theologica <_citation_>
- e.g. "summa theologica I, Q. 1, Art. 1, co."
summa contra gentiles <_citation_>
- e.g. "summa contra gentiles I.20.1" or "summa contra gentiles I.20.1 latin" for latin

__Disclaimers:__

Aquinas bot is an education tool for exploring the works and thinking of Thomas Aquinas. These works fall under the "fair use" of educational purposes, as outlined in Section 107 of the Copyright Act.

Special attribution for the following:
- Project Gutenburg: for open source access to Summa Theoligica
- Benziger Brothers 1947 edition of the Summa Theologica, Translated by Fathers of the English Dominican Province
- St. Isidore library for distributing a number of works from St. Thomas Aquinas

__Contact:__

For any questions, concerns, or bugs please contact Shaun Smith at shaunsmith7@icloud.com
`;

export const helpCommand: Command = {
  data: helpSlashCommand,
  async execute(ctx: AquinasInteractionContext) {
    const { interaction } = ctx;
    await interaction.reply(
      createStandardReply({
        ctx,
        description: helpDescription,
      })
    );
  },
};
