import { ChatInputCommandInteraction, Message } from 'discord.js';

// abstraction into one type
export type ChatInteraction = ChatInputCommandInteraction | Message;
