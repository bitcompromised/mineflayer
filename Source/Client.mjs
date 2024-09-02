/*import Client from './Classes/Client.mjs'

import * as WebhookNode from 'discord-webhook-node';*/
import mineflayer from 'mineflayer';
import readline from 'readline';
import fs from 'fs';
import utils from '../Utilities/Utilities.mjs';
import * as pathfind from 'mineflayer-pathfinder';

function cRequire( path){
	let res;
	try{
		if (fs.existsSync(`./Commands/${path}.mjs`)) {
			let data = fs.readFileSync(`./Commands/${path}.mjs`, 'utf8');
			res = (eval(data))
		}
	} catch (err){
		res = {error: err}
	}
	return res;
}

class CommandHandler{
	#bot;
	busy = false;
	
	commandList = [];
	
	commands = {}
	
	logChannels = {
		"log": console.log,
		"warn": console.warn,
		"error": console.error,
		"message" : console.log,
	}
	
	processCommand(){
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})
		rl.question(`CMD:`, async (cmdText) => {
			
			if(cmdText === '' || !/([a-zA-Z0-9]+)/g.test(cmdText)){
				rl.close();
				return this.processCommand();
			}
			
			let args = cmdText.match(/([a-zA-Z0-9.\-=^$_,|\\%/?!\[\](){}]+)/g);
			let cmd = args.splice(0,1)[0];
			
			if( this.commands.hasOwnProperty(cmd)){
				
				let commandModule = this.commands[cmd.toLowerCase()]
				
				// Busy Check
				
				if( commandModule.makeBusy && this.busy)
					this.logChannels.warn(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Bot is too busy to perform ${cmd}`);
				else {
					
					await commandModule.handler(this.#bot, args);
					
					/*if(commandModule.args === 'string'){
						return rl.question(`${cmd}:`, async (str)=>{
							await commandModule.handler(this.#bot, str)
							rl.close();
							this.processCommand();
						})
					} else {
						commandModule.handler(this.#bot)
					}*/
				}
			} else { // Invalid Command
				if(cmd !== '')
					console.log(`[CMD] Incorrect command ${cmd}, matching commands: [${Object.keys(this.commands).filter(c=>c.match(cmd)).join(',')}]`)
			}
			
			rl.close();
			return this.processCommand();
		})
	}
	
	async load(){
		let start = Date.now();
		console.log("[CommandHandler] Initiated...");
		console.log("[CommandHandler] Loading current commands");
		
		// Load Commands
		
		this.commandList.forEach(cmd=>{
			let mod = this.commands[cmd.toLowerCase()] || cRequire(cmd);
			if(mod instanceof Object && !mod.hasOwnProperty('error')){
				
				if(mod.alias && mod.alias instanceof Array && mod.alias.length >= 0){
					mod.alias.forEach(alias=>{
						if(this.commands.hasOwnProperty(alias.toLowerCase()))
							this.logChannels.error("[CommandHandler] Attempt to overwrite ${alias}");
						else
							this.commands[alias.toLowerCase()] = mod;
					})
				} else if ( mod.alias instanceof String){
					if(this.commands.hasOwnProperty(mod.alias.toLowerCase()))
						this.logChannels.error("[CommandHandler] Attempt to overwrite ${alias}");
					else
						this.commands[mod.alias.toLowerCase()] = mod;
				}
				this.commands[mod.cmd.toLowerCase()] = mod;
			}
			else
				this.logChannels.error(mod);
		})
		console.log(`[CommandHandler] Done in ${(Date.now()-start)/1000} seconds`);
	}
	
	log(channel, message){
		if(this.logChannels.hasOwnProperty(channel))
			try{this.logChannels[channel](message)}catch(err){try{this.logChannels['log'](JSON.stringify(err))} catch(err){console.log(err)}}
		else
			try{this.logChannels['log'](message)} catch(err){console.log(err)};
	}
	setLogFunction(channel, func){
		if(channel && this.logChannels.hasOwnProperty(channel))
			this.logChannels[channel] = ((...data)=>{
				try{
					func(...data);
				} catch(err){
					this.logChannels['error'](err);
				}
			});
	}
	
	setBot( bot){
		this.#bot = bot;
		this.busy = false;
	}
	
	constructor( bot, commandList = []){
		this.#bot = bot;
		this.commandList = commandList;
	}
}


export default class Client{
	
	bot;
	#createBot;
	cmds;
	cmdList;
	
	settings = {
		
	}
	
	connected = 0;
	#rejoin = 0;
	#plugins = [pathfind.pathfinder];
	#events = {
		on : {
			windowOpen: [
				async( window)=>{
					if(/CAPTCHA click the/.test(this.utils.sanitizeText(window.title.value))){
						for (let i = 0; i < 26; i++) {
							let item = slots[i];
							if(item.displayName === 'CLICK ME'){
								await new Promise(r=>setTimeout(r, this.utils.random(2800,6300)))
								return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
							} else {
								if(item.nbt){
									let nbt = this.utils.parseNBT(item.nbt);
									if(nbt.lore && nbt.lore.includes("Click to verify captcha")){
										await new Promise(r=>setTimeout(r, this.utils.random(2800,6300)))
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
									}
								}
							}
							
						}
					} 
					
				}
			],
			message: [
				async( jsonMessage, sender)=>{
					let details = this.utils.parseMessage( jsonMessage, sender);
					if(details.tags.includes(`[MSG ${this.utils.formatDate(new Date(Date.now()))}]`) && details.sender !== 'You'){
						this.cmds.logChannels.error(`[MSG ${this.utils.formatDate(new Date(Date.now()))}] ${details.sender} > ${this.bot.username}: ${details.text}`);
						console.log(`[MSG ${this.utils.formatDate(new Date(Date.now()))}] ${details.sender} > ${this.bot.username}: ${details.text}`)
					} else if (details.tags.includes(`[MSG ${this.utils.formatDate(new Date(Date.now()))}]`) && details.sender === 'You') {
						console.log(`[MSG ${this.utils.formatDate(new Date(Date.now()))}] ${details.sender} > ${this.bot.username}: ${details.text}`)
					}
				}
			],
			kicked: [
				async ( reason)=>{
					this.cmds.logChannels.error(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Bot kicked for ${JSON.stringify(reason)}`);
					if(this.#rejoin && this.connected) {
						this.connected = false;
						this.bot.quit();
						this.cmds.logChannels.error(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Attempting to rejoin in 5 minutes`);
						await new Promise(r=> setTimeout(r, 60000*5));
						this.bot = this.createBot( this.settings);
					}
				},
			],
			end: [
				async ( reason)=>{
					console.log(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Session has ended with reason: ${reason}`);
					if(reason === 'socketClosed' && this.#rejoin && this.connected){
						this.connected = false;
						this.bot.quit();
						console.log(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Attempting to rejoin in 5 minutes`);
						await new Promise(r=> setTimeout(r, 60000*5));
						this.bot = this.createBot( this.settings);
					}
				}
			],
			resourcePack: [
				(url, hash)=>{
					console.log("[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Accepting resource pack ${url}")
					this.bot.acceptResourcePack()
				}
			]
		},
		once : {
			spawn: [
				async ()=>{
					this.connected = true;
					console.clear();
					//this.cmds.logChannels.log(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Logged in with username: ${this.bot.username}`);
					this.cmds.load()
					.then(()=>{
							console.log(`[CLIENT ${this.utils.formatDate(new Date(Date.now()))}] Ready [${this.bot.username}]`)
							this.cmds.processCommand();
						}
					);
					
					this.settings.hasOwnProperty('cf') ?? (()=>{
						this.settings.cf.toggled ?? this.bot.chat(`/cf ${this.settings.cf.bet} ${this.utils.random(0,1) ? 'heads' : 'tails'}`)
					})
				}
			]
		},
	}
	
	on(event, callback){
		if(!this.#events.on.hasOwnProperty(event))
			this.#events.on[event] = [callback];
		else
			this.#events.on[event].push(callback);
		this.bot.on(event, callback);
	}
	once(event, callback){
		if(!this.#events.once.hasOwnProperty(event))
			this.#events.once[event] = [callback];
		else
			this.#events.once[event].push(callback);
		this.bot.once(event, callback);
	}
	
	async login(){
		while(!this.connected)
			await new Promise(r=>setTimeout(r, 300));
	}
	
	async createBot( settings){
		while(!settings.hasOwnProperty('username') || settings.username === '')
			await new Promise(r=>setTimeout(r, 3000));
		this.bot = this.#createBot( settings);
		this.#plugins.forEach(f=>this.bot.loadPlugin(f));
		Object.entries(this.#events.on).forEach((value)=>{
			value[1].forEach(f=>this.bot.on(value[0], f))
		})
		Object.entries(this.#events.once).forEach((value)=>{
			value[1].forEach(f=>this.bot.once(value[0], f))
		})
		this.cmds = new CommandHandler( this, this.cmdList);
		this.connected = true;
		return this.bot;
	}
	
	constructor( settings, cmds, rejoin = 0){
		this.Movements = pathfind.Movements;
		this.goals = pathfind.default.goals;
		
		if(!settings.hasOwnProperty('username')){
			let rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			})
			rl.question(`[CLIENT] Username:`, async (str) => {
				settings.username = str;
				rl.close();
			})
		}
		
		this.#rejoin = rejoin;
		this.#createBot = mineflayer.createBot || createBot;
		this.cmdList = cmds;
		this.utils = utils;
		this.createBot( settings)
			.then(bot=> this.bot = bot)
	}
}