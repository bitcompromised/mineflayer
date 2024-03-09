/*import Client from './Classes/Client.mjs'
import * as pathfind from 'mineflayer-pathfinder';
import * as WebhookNode from 'discord-webhook-node';*/
import mineflayer from 'mineflayer';
import readline from 'readline';
import fs from 'fs';


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
		rl.question(`CMD:`, async (cmd) => {
			if( this.commands.hasOwnProperty(cmd)){
				
				let commandModule = this.commands[cmd.toLowerCase()]
				
				// Busy Check
				
				if( commandModule.makeBusy && this.busy)
					this.logChannels.warn(`[CLIENT] Bot is too busy to perform ${cmd}`);
				else {
					
					if(commandModule.args === 'string'){
						return rl.question(`${cmd}:`, (str)=>{
							commandModule.handler(this.#bot, str)
							rl.close();
							this.processCommand();
						})
					} else {
						commandModule.handler(this.#bot, null)
					}
				}
				
			} else { // Invalid Command
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
			let mod = cRequire(cmd);
			if(mod instanceof Object && !mod.hasOwnProperty('error'))
				this.commands[cmd.toLowerCase()] = mod;
			else
				this.logChannels.error(mod);
		})
		console.log(`[CommandHandler] Done in ${(Date.now()-start)/1000} seconds`);
	}
	
	log(channel, message){
		if(this.logChannels.hasOwnProperty(channel))
			this.logChannels[channel](message);
		else
			this.logChannels['log'](message);
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
	
	constructor( bot, cmdNameList = []){
		this.#bot = bot;
		this.commandList = cmdNameList;
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
	#plugins = [];
	#events = {
		on : {
			kicked: [
				async ( reason)=>{
					console.log(`[Client] Bot kicked for ${JSON.stringify(reason)}`);
					if(this.#rejoin && this.connected) {
						this.connected = false;
						this.bot.quit();
						console.log(`[Client] Attempting to rejoin in 5 minutes`);
						await new Promise(r=> setTimeout(r, 60000*5));
						this.bot = this.createBot( this.settings);
					}
				},
			],
			end: [
				async ( reason)=>{
					console.log(`[Client] Session has ended with reason: ${reason}`);
					if(reason === 'socketClosed' && this.#rejoin && this.connected){
						this.connected = false;
						this.bot.quit();
						console.log(`[Client] Attempting to rejoin in 5 minutes`);
						await new Promise(r=> setTimeout(r, 60000*5));
						this.bot = this.createBot( this.settings);
					}
				}
			],
			resourcePack: [
				(url, hash)=>{
					console.log("[CLIENT] Accepting resource pack ${url}")
					this.bot.acceptResourcePack()
				}
			]
		},
		once : {
			spawn: [
				async ()=>{
					this.connected = true;
					console.clear();
					console.log(`[Client] Logged in with username: ${this.bot.username}`);
					this.cmds.load()
					.then(()=>{
							console.log("[Client] Ready")
							this.cmds.processCommand();
						}
					);
				}
			]
		},
	}
	
	on(event, callback){
		if(!this.events.on.hasOwnProperty(event))
			this.events.on[event] = [callback];
		else
			this.events.on[event].push(callback);
		this.bot.on(event, callback);
	}
	once(event, callback){
		if(!this.events.once.hasOwnProperty(event))
			this.events.once[event] = [callback];
		else
			this.events.once[event].push(callback);
		this.bot.once(event, callback);
	}
	
	createBot( settings){
		this.bot = this.#createBot( settings);
		this.#plugins.forEach(f=>this.bot.loadPlugin(f));
		Object.entries(this.#events.on).forEach((value)=>{
			value[1].forEach(f=>this.bot.on(value[0], f))
		})
		Object.entries(this.#events.once).forEach((value)=>{
			value[1].forEach(f=>this.bot.once(value[0], f))
		})
		this.cmds = new CommandHandler( this, this.cmdList);
		return this.bot;
	}
	
	constructor( createBot, settings, cmds, rejoin = 0){
		this.#rejoin = rejoin;
		this.#createBot = mineflayer.createBot || createBot;
		this.cmdList = cmds;
		this.bot = this.createBot( settings);
	}
}