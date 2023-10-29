import channels from '../jsons/channels.json' assert {type: 'json'};
import config from '../jsons/config.json' assert {type: 'json'};
import { ChatClient, AlternateMessageModifier, SlowModeRateLimiter } from '@kararty/dank-twitch-irc';

const client = new ChatClient({
    username: config.username,
    password: config.password
});

client.use(new AlternateMessageModifier(client));
client.use(new SlowModeRateLimiter(client, 15));

client.joinAll(channels.channelsToJoin);

client.on('JOIN', ({channelName}) => {
    console.log(`Joined #${channelName}`)
});

client.on("PRIVMSG", (msg) => {
    console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
});

console.log(`Connected to ${channels.channelsToJoin.length} channels.`);

export { client };