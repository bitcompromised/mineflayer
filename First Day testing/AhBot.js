import Client from './Classes/Client.mjs'
import readline from 'readline';
import mineflayer from 'mineflayer';

const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: 'bigtoker443', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
});

const matches = ( string, ...list) => list.includes(string);

const itemParser = ( item ) => {
	let customItem = {
		id: 0,
		name: null,
		enchants: null,
		lore: null,
		slot: 0,
	}
}

let settings = {
	curWindow: null,
}