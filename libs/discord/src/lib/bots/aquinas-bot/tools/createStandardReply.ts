import { AquinasInteractionContext } from '@shared/types';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';

export function createStandardReply({
  ctx,
  title = 'Aquinas Bot',
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

  const baseEmbed = {
    title,
    color: 10038562,
    description,
    footer: {
      text: `${appName} ${appVersion}`,
    },
    thumbnail: {
      url: `attachment://thomas-icon.png`,
    },
  };
  return {
    embeds: [baseEmbed],
    files: [thomasIcon],
  };
}
