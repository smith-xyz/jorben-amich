import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { pingSlashCommand } from '../slash-command-config';

const prayerSnippets = [
  "Come, Holy Spirit, Divine Creator, the true source of light and fountain of wisdom...yes I'm here.",
  'Sweet Jesus, Body and Blood most Holy, be the delight and pleasure of my soul...what do you need?',
  'Pour forth your brilliance upon my intellect, dissipate the darkness which covers me, that of sin and of ignorance...you requested me?',
  'Let me rejoice in nothing but what leads to You, nor grieve for anything that leads away from You...must you disturb my reflection time?',
  'Grant me the talent of being exact in my explanations...especially for this Discord channel!',
  'My Queen, come to my aid and deliver me from the snares of the devil...yes?',
  'May all joy be meaningless without You and may I desire nothing apart from You...oh, hello.',
  'Give me, O God, an ever watchful heart which nothing can ever lure away from You...nor lure my intellect from this Discord channel!',
];

export const pingCommand: Command = {
  data: pingSlashCommand,
  async execute(ctx: AquinasInteractionContext) {
    const rand = Math.floor(Math.random() * prayerSnippets.length - 1);
    await ctx.interaction.reply(prayerSnippets[rand]);
  },
};
