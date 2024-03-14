// node Main.js < server > < username > < proxy ? ...autoRun > < proxy_string ? ...autoRun >


import process from 'node:process';
import { Client } from './Classes/Client.mjs';
import * as WebhookNode from 'discord-webhook-node';
import colors from 'colors';

let path = process.argv[1];
let args = process.argv.splice(2);

let host = args.splice(0,1)[0];
let username = args.splice(0,1)[0];

if(!host || !username){
	// Get server && username from user input
	process.exit(1);
}

let settings = {
	host,
	username,
	//autoRun: [],
	//proxy: "",
	version: '1.8',
}

if(args[0] === 'proxy'){
	if(/socks\d:\/\/([\w\d_]+):([\w\d_]+)@\d+\.\d+\.\d+\.\d+:\d+/.test(args[1])){
		settings.proxy = args.splice(1,1)[0];
		settings.autoRun = args.splice(1);
	}
} else {
	settings.autoRun = args.splice(0);
}
let client = new Client( settings);


const sanitizeText = ( msg ) => msg.replaceAll(/§\w|§\d/g, '');

const color_index= {
}


function colorText(text, style = 'white'){
	return
}

function parseMessage( jsonMsg, clickEvents = [], hoverEvents = []){
	
	let newMessage = {
		sender: null,
		user: null,
		text: '',//jsonMsg.getText(),
		coloredText: '',//colorText( jsonMsg.getText()),
		clickEvents,
		hoverEvents
	}
	
	return newMessage
}
let parseNBT = (item) => {
		let newitem = {};
		return newitem;
	}
client.done()
	.then(()=>{
		// Bot Created;
		
		// messageFunction
		let pp_chats_webhook = new WebhookNode.Webhook("https://discord.com/api/webhooks/1215928921691000905/wqLVjpGUMl_3c0bqoPLRsozI6I1qg-SoklkcqKOcZz6qU-VSg-jSIpcpo1qcd9vBDCuV");
		let pp_chats = [];
		
		let PurplePrison = client.database.get( 'purpleprison', true);
		let PlayersDB = PurplePrison.get('players', '{}');
		let PlotShopsDB = PurplePrison.get('shops', '{}');
		
		
		client.on('playerJoined', (player)=>{
			if( !player.username.match(/CIT-[\d\w]+/) && !PlayersDB.get(player.username)){
				PlayersDB.set(player.username, {});
				PlayersDB.save();
			}
		})
		
		
		
		client.events.on('balance', (balance)=>client.settings.set('balance', balance))
		client.events.on('ping', (ping)=>client.settings.set('ping', ping))
		client.events.on('message', (message)=>{
			//console.log( message.raw);
		})
		client.events.on('unclaimed-item', ()=>{
			//client.bot.chat('/claim');
		})
		
		client.on('message', (jsonMsg)=>{
			
			let {
				sender,
				user,
				text,
				coloredText,
				clickEvents,
				hoverEvents
			} = parseMessage(jsonMsg);
			
			try{
			
			if (/You have a ping of/.test(text)){
				client.events.emit('ping', Number(text.match(/You have a ping of ([\d+])/)[1]))
			}
			else {
				pp_chats.push("`"+text.replaceAll(/(§\d|§\w)/g, '')+' '+clickEvents.length && clickEvents.join(",")+ (hoverEvents.length && hoverEvents[0].split(/\n/).filter(e=>e.match(/Balance/))[0].match(/\$\d.*/)[0]) +"`");
				if(pp_chats.length % 10 === 0){
					pp_chats_webhook.send(pp_chats.join(`\n`))
					pp_chats = [];
				}
			} catch(err){
				console.log(err);
			};
			
		})
		
		client.once('spawn', async ()=>{
			let pos = client.bot.entity.position.floored()
			console.log(`[CLIENT] Spawning on server with Position [ ${pos.x}, ${pos.y}, ${pos.z}]`)
			if(pos.x === -17 && pos.y === 53 && pos.z === -141){
				client.bot.setControlState('forward', true);
				await new Promise(r=> setTimeout(r, 1500));
				client.bot.setControlState('forward', false);
			}
			client.bot.chat('/bal');
			client.bot.chat('/ping');
      
			Object.keys(client.bot.players).forEach(p=>{
				if( !p.match(/CIT-[\d\w]+/) && !PlayersDB.get(p)){
					PlayersDB.set(p, {});
				}
			})
			PlayersDB.save();
			
			let players = Object.keys(PlayersDB.record);
			
			let pshops = Object.keys(PlotShopsDB.record);
			let needs = players.filter(p=>!pshops.includes(p))
			console.log(needs.length);
			for( let i= 0; i <= needs.length; i++){
				if(!client.connected){
					console.log('waiting', client.settings.get('rejoin').delay + 5000, 'ms'.blue.dim);
					i--;
					await new Promise( r=>setTimeout(r, client.settings.get('rejoin').delay + 5000));
					continue;
				}
				if( i % 10)
					PlotShopsDB.save();
				let player = needs[i];
				if( pshops.includes(player)){
					console.log(`Skipping ${i}/${needs.length}`)
					continue;
				}
					
				let pos = client.bot.entity.position.floored();
				client.bot.chat(`/p h ${player}`);
				await new Promise(r=>setTimeout(r, 1100));
				if( !client.bot.entity){
					await new Promise(r=>setTimeout(r, 500));
				}
				if( pos.equals(client.bot.entity.position.floored())){
					console.log(`Skipping ${player} ${i}/${needs.length}`)
					PlotShopsDB.set( player, null);
				}else {
					let findBlocks = client.bot.findBlocks({
							matching: (block) => {
								if (block.name.match("sign") || block.displayName.match("sign"))
									return true;
								return false;
							},
							maxDistance: 80,
							count: 9e9
						})
							.map(vec3 => client.bot.blockAt(vec3, true).getSignText()[0])
							.filter(text => text.match("[Buy Shop]") || text.match("[Sell Shop]"))
							.filter(text=>(
								text.match(player) &&
								text.match('8=========D')
							));
					if(findBlocks.length > 0){
						let text = findBlocks.map(shopSign=>shopSign.replaceAll(`\n`,' | '))
						.join(`\n`).replaceAll(`[Sell Shop] |`, '[S]').replaceAll(`[Buy Shop] |`, '[B]');//.split(``);
						console.log(`Checked ${player}'s plot, found ${findBlocks.length} shops`);
						PlotShopsDB.set( player, text);
						PlotShopsDB.save();
					} else {
						PlotShopsDB.set( player, []);
					}
				}
			}
			PlotShopsDB.save();
		})
	})
