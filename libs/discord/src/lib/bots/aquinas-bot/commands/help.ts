import { Command } from '@shared/clients';
import { AquinasInteractionContext } from '@shared/types';
import { helpSlashCommand } from '../slash-command-config';
import { createBaseInteractionReply } from '../views';

const buildHelpDescription = ({
  st,
  scg,
  search,
  ping,
}: {
  st: string;
  scg: string;
  search: string;
  ping: string;
}) => `

__Slash Commands:__

</st:${st}> to fetch specified entry from _Summa Theologiæ_.

</scg:${scg}> to fetch specified entry from _Summa Contra Gentiles_, latin available.

</search:${search}> for full text search of specific works. This uses an FTS5 search algorithm for the results. For more information [click here](https://www.sqlite.org/fts5.html). Each result will link to St. Isodre library for further reading.

</ping:${ping}> for checking if aquinas bot is running.

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
    const commandsCollectionCache =
      interaction.client.application.commands.cache;

    if (commandsCollectionCache.size === 0) {
      console.debug('refreshing command cache');
      const commands = await interaction.client.application.commands.fetch();
      commandsCollectionCache.merge(
        commands,
        () => ({ keep: false }),
        (valueOther) => ({ keep: true, value: valueOther }),
        (_, valueOther) => ({ keep: true, value: valueOther })
      );
    }

    const commandIds = {
      st: null,
      scg: null,
      search: null,
      ping: null,
    };

    for (const [, commandConfig] of commandsCollectionCache.entries()) {
      commandIds[commandConfig.name] = commandConfig.id;
    }

    await interaction.reply(
      createBaseInteractionReply({
        ctx,
        description: buildHelpDescription(commandIds),
      })
    );
  },
};
