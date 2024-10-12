import { AquinasBotClient, InteractionContext } from '@shared/types';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import path from 'path';

export const globalViewConfig = {
  title: 'Aquinas Bot',
  color: 10038562,
  thumbnail: 'attachment://thomas-icon.png',
};

export interface BaseReply {
  embeds: EmbedBuilder[];
  files: AttachmentBuilder[];
  components: any[]; // todo: not sure why but the action row builder isn't matching on the types
}

export function createBaseInteractionReply({
  ctx,
  title = globalViewConfig.title,
  description = '',
}: {
  ctx: InteractionContext<AquinasBotClient>;
  title?: string;
  description?: string;
}) {
  const { assetsDir, appName, appVersion } = ctx.client.context;
  const thomasIcon = new AttachmentBuilder(
    path.join(assetsDir, `/thumbnails/thomas-icon.png`)
  );

  const baseEmbed = new EmbedBuilder()
    .setTitle(title)
    .setColor(globalViewConfig.color)
    .setDescription(description)
    .setFooter({
      text: `${appName} ${appVersion}`,
    })
    .setThumbnail(globalViewConfig.thumbnail);

  return {
    embeds: [baseEmbed],
    files: [thomasIcon],
    components: [],
  };
}
