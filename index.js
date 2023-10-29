/* ---------Imports------- */
import {client} from './src/client.js';
import update from './src/updateJson.js';
import config from './jsons/config.json' assert {type: 'json'};
import channels from './jsons/channels.json' assert {type: 'json'};
import data from './jsons/data.json' assert {type: 'json'}

import * as fs from 'fs';

const potatoCommands = ['potato', 'steal', 'trample', 'cdr'];

/* --------Bot------------ */
client.on('PRIVMSG', async (msg) => {
	const channel = msg.channelName;
	const slicedMessage = msg.messageText.split(' ');
	const sender = msg.senderUsername.toLowerCase();

	/* potato collector */
	if(sender == 'potatbotat'){ /* relies on '#potato remind all' and '#potato verbose' */
		if(slicedMessage[0] == 'ryanpo1UWAA' && slicedMessage[1] == `@${config['username']}`){
			for(let i = 0; i < potatoCommands.length; i++){
				if(msg.messageText.includes(potatoCommands[i])){
					switch(i){
					case 0:
						setTimeout(() => {client.say(channel, '#potato')}, 1000);
					break;
					case 1:
						setTimeout(() => {client.say(channel, '#steal')}, 2000);
					break;
					case 2:
						setTimeout(() => {client.say(channel, '#trample')},3000);
					break;
					case 3:
						setTimeout(() => {client.say(channel,'#cdr')}, 4000);
						setTimeout(() => {client.say(channel,'#potato')}, 5000);
						setTimeout(() => {client.say(channel,'#steal')}, 6000);
						setTimeout(() => {client.say(channel,'#trample')}, 7000);
					break;
					}
				}
			}
		}

		/* Data collection */

		if(slicedMessage[0].toLowerCase() == `@${config['username']}`){
			switch(slicedMessage[1]){
				case 'ryanpo1UWAA': 
					update('gambaWon', slicedMessage);
				break;
				case 'ryanpo1KEK':
					update('gambaLost', slicedMessage);
				break;
				case '🥳':
					update('quiz', slicedMessage);
				break;
				default:
					update('potato/steal/cooldown', slicedMessage);
				break; 
			}
		}
		fs.writeFileSync('./jsons/data.json', JSON.stringify(data, null, 2), 'utf-8');
	}

	if(!slicedMessage[0].startsWith('!') || sender != config['username']) return;

	const messageID = msg.messageID;
	const [command, ...commandArguments] = slicedMessage;
	const rawMessage = msg.messageText.slice(command.length+1);

	switch(command){
		case '!potato':
		case '!p':
			client.reply(channel, messageID, `MrDestructoid Potatoes: ${data.potatoes.toLocaleString("de-DE")}`);
		break;
		case '!total':
		case '!t':
			client.reply(channel, messageID, `MrDestructoid Total potatoes: ${data.totalPotatoes.toLocaleString("de-DE")}`);
		break;
		case '!join':
			try{
				if(commandArguments.length == 0){throw 'Insufficient parameters.'}

				client.join(commandArguments[0].toLowerCase());
				client.reply(channel, messageID, `MrDestructoid Joining #${commandArguments[0]}`);

				channels['channelsToJoin'].push(commandArguments[0].toLowerCase());
				fs.writeFileSync('./jsons/channels.json', JSON.stringify(channels, null, 2));
			}catch (error){
				console.log(`MrDestructoid Unexpected error: ${error}`);
			}
		break;
		case '!part':
			try{
				if(commandArguments.length == 0){
					client.part(channel);
					channels['channelsToJoin'].splice(channels['channelsToJoin'].indexOf(`${channel}`),1);
					fs.writeFileSync('./jsons/channels.json', JSON.stringify(channels, null, 2));
					break;
				}

				let elementIndexToRemove = channels['channelsToJoin'].indexOf(`${commandArguments[0].toLowerCase()}`);

				if(elementIndexToRemove == -1){
					throw 'Channel not found.';
				}

				client.part(commandArguments[0].toLowerCase());
				client.reply(channel, messageID, `MrDestructoid Leaving #${commandArguments[0]}`);

				channels['channelsToJoin'].splice(elementIndexToRemove, 1);
				fs.writeFileSync('./jsons/channels.json', JSON.stringify(channels, null, 2));
			}catch (error){
				console.log(`Unexpected error: ${error}`);
			}
		break;
	}
});