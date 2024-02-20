import { AquinasInteractionContext } from '@shared/types';
import {
  APIActionRowComponent,
  APIActionRowComponentTypes,
  APIMessageActionRowComponent,
  ActionRowBuilder,
  ActionRowData,
  AttachmentBuilder,
  EmbedBuilder,
  JSONEncodable,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
} from 'discord.js';
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
  ctx: AquinasInteractionContext;
  title?: string;
  description?: string;
}) {
  const {
    appCtx: { assetsDir, appName, appVersion },
  } = ctx;
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
