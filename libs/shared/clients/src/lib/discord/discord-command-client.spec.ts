import { DiscordCommandClient } from './discord-command-client';

describe('DiscordCommandClient', () => {
  it('should work', () => {
    expect(
      new DiscordCommandClient({ intents: [] }).getCommandByKey('test')
    ).toBeUndefined();
  });
});
