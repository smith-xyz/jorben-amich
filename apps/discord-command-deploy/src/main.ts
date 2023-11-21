/**
 * @description just for deploying slash commands for this bot,
 * currently part of the app but is not directly used elsewhere in the app
 */

import { REST, Routes } from 'discord.js';
import { discordBots } from '@discord';
import { FileUtils, PathUtils, TypeUtils } from '@shared/utilities';
import {
  AquinasBotAppName,
  DiscordBotConfig,
  DiscordBotConfigMap,
  DiscordBotNames,
} from '@shared/types';

const missing = ['DISCORD_BOTS_CONFIG_FILE'].filter(
  (variable) =>
    !process.env[variable] ||
    (typeof process.env[variable] === 'string' &&
      process.env[variable].length === 0)
);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(',')}`);
}

(async () => {
  const botsConfig = FileUtils.readJSONFile<
    DiscordBotConfigMap<AquinasBotAppName>
  >(PathUtils.resolveToCwd(process.env.DISCORD_BOTS_CONFIG_FILE));

  const discordBotNames = TypeUtils.getTypedKeys(botsConfig);

  const botsMap = new Map<DiscordBotNames, DiscordBotConfig>(
    discordBotNames.map((key) => [key, botsConfig[key]])
  );

  for (const [botName, config] of botsMap) {
    if (!config || !config.token || !config.clientId) {
      throw new Error(`ERROR= missing creds for bot ${botName}`);
    }

    const discordBot = discordBots[botName];
    if (!discordBot || !discordBot.commands) {
      console.log(`No commands for bot ${botName}`);
      continue;
    }

    const commands = discordBot.commands.map((cmd) => cmd.data);

    const { token, clientId, guildId } = config;

    const rest = new REST().setToken(token);

    try {
      console.log(
        `BOT=${botName} MSG=Started refreshing ${commands.length} application (/) commands.`
      );

      // if no guildId then its for all guilds
      const route = guildId
        ? Routes.applicationGuildCommands(clientId, guildId)
        : Routes.applicationCommands(clientId);

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(route, { body: commands });

      console.log(
        `BOT=${botName} MSG=Successfully reloaded ${data['length']} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(`BOT=${botName} ERROR_MSG=${error.message}`);
    }
  }
})();
