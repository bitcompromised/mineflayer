const request = global.request || await import('request'); global.request = request;
const mc = global.mc || await import('minecraft-protocol'); global.mc = mc;
const mineflayer = global.mineflayer || await import('mineflayer'); global.mineflayer = mineflayer;
const proxyAgent = global.proxyAgent || await import('proxy-agent'); global.proxyAgent = proxyAgent;
const readline = global.readline || await import('readline'); global.readline = readline;
const socks = global.socks || await import('socks'); global.socks = socks;
const http = global.http || await import('http'); global.http = http;
const fs = global.fs || await import('fs'); global.fs = fs;
const checkProxy = global.checkProxy || (await import('check-proxy')).check;global.checkProxy = checkProxy;
const utilities = global.utilities || (await import('./Utilities.mjs')); global.utilities = utilities; 

class CommandSystem{
	#Commands = {
		
	}
	
	#Client;
	
	init(){
		let commandFiles = ['Commands']
		if ( this.#Client.debug){
			commandFiles.push('Commands/Debug')
		}
		commandFiles.forEach(folder=>{
			fs.readdirSync(`./${folder}`).forEach( async entry=>{
				if( entry.match(/.js|.mjs|.exe|.txt/)){
					let Module;
					try{
						Module = eval(fs.readFileSync(`./Commands/${entry}`, 'utf8'));
						if(Module.load && Module.load instanceof Function)
							Module.load( this.#Client);
					} catch(err){
						console.log("[CommandModule]".magenta,`error loading ${entry}: `, err.message.red)
					}
					if( Module)
						this.#Commands[Module.name] = Module;
				}
			})
		})
		
	}
	async Exec( cmd, args){ // for processes only
		let match = this.get( cmd)
		await match.run( this.#Client, args);
	}
	Input( rl){
		rl.question('> ', async res=>{
			if(res === '' || !/([a-zA-Z0-9]+)/g.test(res))
				return this.Input( rl);
			
			
			let args = res.split(' ');
			let cmd = args.splice(0,1)[0];
			args = args.map(arg=>{
				if(args[0].matchAll(/[0-9]/g)[0] == args[0])
					return Number(args[0])
				else if (args[0].match(/true|false/)){
					if(args[0].match(/true/))
						return true;
					else
						return false;
				} else
					return arg;
			})
			
			if( cmd === 'help' || cmd === 'h'){
				return (()=>{
					// Help Function
					if( args.length){
						
							// Help page or help with a specific command
						if(typeof(args[0]) === 'number'){
							// if Arg is a number
						} else {
							let Module = this.get( args[0])
							if(Module){
								console.log(`Command: ${Module.name}\nAliases: ${Module.alias}\nUsage: ${Module.usage}\nDescription: ${Module.description}`)
							}
						}
					} else {
						// Default help display
						console.log(`Command: help\nAliases: h\nUsage: help <page | command>\nDescription: Presents you with a page like this, with information on commands`)
					}
					return this.Input( rl);
				})()
				
			} else if ( cmd === 'cmds' || cmd === 'commands'){
				return (()=>{
					Object.values(this.#Commands).forEach((Module)=>{
						console.log(`${Module.name} | ${Module.description}`)
					})
					return this.Input( rl);
				})()
			}
			
			let match = this.get( cmd)
			
			if( match && match.run){
				await match.run( this.#Client, args);
			} else {
				if(res !== '')
					console.log(`${'[CommandModule]'.magenta} Invalid command ${cmd}, matching commands: ${match}`)
			}
			return this.Input( rl);
		})
	}
	
	get( cmd){
		let Module = this.#Commands[cmd];
		if(Module && Module.run)
			return Module;
		else {
			let cmds = Object.values(this.#Commands);
			let matches = cmds.filter( mod=> mod && (mod.name.match(cmd) || mod.alias.includes( cmd)))
			if( matches.length){
				if(!matches.filter( mod=> mod && mod.name === cmd).length && !matches.filter( mod=> mod && mod.alias.includes( cmd)).length === 1 ){
					return matches.map(mod=>[mod.name, ...mod.alias]);
				} else {
					//return matches.map(mod=>[mod.name, ...mod.alias]);
					return matches[0]; // Autoruns cmds
				}
			}
			return false
		}
			
	}
	
	constructor( Client){
		this.#Client = Client;
		this.init()
	}
}

class ChannelSystem{
	
	#channels = {
		log: {
			on:[],
			once:[]
		},
		warn: {
			on:[],
			once:[]
		},
		error: {
			on:[],
			once:[]
		},
	}
	getListeners( channel){
		return this.#channels.channel;
	}
	removeListener( channel, f, typ){
		
	}
	removeListeners( channel, f){
		
	}
	
	emit( channel, ...content){
		if(this.#channels[channel]){
			let c = this.#channels[channel]
			c.on.forEach(f=>f(...content));
			c.once.forEach(f=>c.once.pop()(...content));
		}
	}
	on( channel, callback){
		if(this.#channels[channel])
			this.#channels[channel].on.push(callback)
		else
			this.#channels[channel] = { on: [ callback], once: []};
	}
	once( channel, callback){
		if(this.#channels[channel])
			this.#channels[channel].once.push(callback)
		else
			this.#channels[channel] = { on: [], once: [ callback]};
	}
	constructor(){
		
	}
}

class Entry{ // representing example.logFiles. plotShops.json
	
	#path;
	#db_o;
	
	get(key){
		if(this.#db_o.hasOwnProperty(key))
			return this.#db_o[key]
		else
			return false;
	}
	set(key, value){
		this.#db_o[key] = value;
	}
	save(){
		fs.writeFileSync(this.#path, JSON.stringify(this.#db_o))
	}
	get record(){
		return this.#db_o;
	}
	
	constructor( o, path){
		this.#db_o = o;
		this.#path = path;
	}
}


class Database{
	path;
	#entries = [];
	#Entries = {}
	
	create( entry, def){
		let file = fs.createWriteStream( `${this.path}/${entry}.json`);
		file.write(def);
		file.end();
		this.#entries.push(`${entry}.json`)
		this.#Entries[entry] = new Entry( JSON.parse( def), `${this.path}/${entry}.json`)
		return this.#Entries[entry];
	}
	
	get( entry, def){
		if(this.#entries.includes(entry+'.json')){
			if(this.#Entries[entry]){
				return this.#Entries[entry];
			} else {
				this.#Entries[entry] = new Entry( JSON.parse( fs.readFileSync(`${this.path}/${entry}.json`, 'utf8')), `${this.path}/${entry}.json`)
				return this.#Entries[entry];
			}
		} else if (def){
			return this.create( entry, def)
		}
		// mkFolder(./JavusDatabaseV/${databaseName})
			// mkFile(./JavusDatabaseV/${databaseName}/${entry}.json)
			// return Entry
	}
	
	
	
	constructor( path, entries = []){
		this.path = path;
		this.#entries = entries;
	}
}

class DatabaseSystem{
	dataBases = {
		/*example:{
			path: './JavusDatabaseV1/example',
			logFiles: ['plotShops.json'],
		}*/
	}
	get( databaseName, createIfNull){
		if(this.dataBases.hasOwnProperty( databaseName))
			return this.dataBases[ databaseName]
		else if(createIfNull)
			return this.create( databaseName)
	}
	create( databaseName){
		if(!fs.existsSync(`./DatabaseV1/${databaseName}`))
			fs.mkdirSync(`./DatabaseV1/${databaseName}`);
		this.dataBases[databaseName] = new Database(`./DatabaseV1/${databaseName}`,fs.readdirSync(`./DatabaseV1/${databaseName}`))
		return this.dataBases[databaseName]
	}
	
	constructor(){
		
		if(!fs.existsSync('./DatabaseV1'))
			fs.mkdirSync('./DatabaseV1');
		
		fs.readdirSync('./DatabaseV1').forEach(databaseName=>{
			this.dataBases[databaseName] = new Database(`./DatabaseV1/${databaseName}`,fs.readdirSync(`./DatabaseV1/${databaseName}`))
		})
	}
	
}

export class Client{
	
	
	
	bot = undefined;
	connected = false;
	
	database = new DatabaseSystem();
	events = new ChannelSystem();
	utils = utilities;
	cmd = new CommandSystem( this);
	
	
	#clientSettings = {}
	#events = {
		on:{
			windowOpen: [async( window)=>{
				//console.log('[CLIENT] Window Opened: ', JSON.parse(window.title).text.replaceAll(/§\w|§\d/g, ''));
				if(/CAPTCHA click the/.test(JSON.parse(window.title).text.replaceAll(/§\w|§\d/g, ''))){
					for (let i = 0; i < 26; i++) {
						let item = window.slots[i];
						if(item.displayName === 'CLICK ME'){
							await new Promise(r=>setTimeout(r, 1100))
							return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
						} else {
							if(item.nbt){
								let nbt = this.utils.parseNBT(item.nbt);
								if(nbt.lore && nbt.lore.includes("Click to verify captcha")){
									await new Promise(r=>setTimeout(r, 2100))
									return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
								}
							}
						}
						
					}
				} else if (/Click the/.test(JSON.parse(window.title).text)){
					let toClick = JSON.parse(window.title).text.match(/\w+/g).splice(2);
					for( let i = 0; i < window.inventoryStart - 1; i++){
						toClick.forEach(match=>{
							if(window.slots[i] && window.slots[i].name.match(match))
								this.bot.simpleClick.leftMouse (i);
						})
					}
				}
			}]
		},
		once:{
			
		}
	}
	
	on( event, callback){
		if(this.#events.on[event])
			this.#events.on[event].push(callback)
		else
			this.#events.on[event] = [callback];
		this.connected && this.bot.on(event, callback);
	}
	once( event, callback){
		if(this.#events.once[event])
			this.#events.once[event].push(callback)
		else
			this.#events.once[event] = [callback];
		this.connected && this.bot.once(event, callback);
	}
	
	createBot( ManualHost = false){
		const Client = this;
		
		if(this.bot && this.connected)
			return console.log("Attempting to create a bot when a bot is still active.?".bgRed);
		let settings = (()=>{ let { username, password, host, auth} = this.#clientSettings; return { username, password, host, auth}})()
		if(ManualHost)
			settings.host = ManualHost;
		if( this.#clientSettings.proxy){
			switch( this.#clientSettings.proxy.type){
				case 'socks':
					if(parseInt(this.#clientSettings.proxy.link.match(/\d/g)[0]) !== 4 && parseInt(this.#clientSettings.proxy.link.match(/\d/g)[0]) !== 5)
						throw new Error("[PROXY]".blue.dim+ " Incorrect proxy socks version".red);
					console.log('[PROXY]'.blue.dim, 'Initiating Proxy'.yellow.dim);
					settings.client = mc.createClient({
						agent: new proxyAgent.ProxyAgent( this.#clientSettings.proxy.link),
						username: settings.username,
						password: settings.password,
						auth: settings.auth,
						version: '1.17.1',
						host: settings.host,
						connect: client =>{
							socks.SocksClient.createConnection({
								proxy: { // proxy connection
									host: this.#clientSettings.proxy.ip,
									port: parseInt(this.#clientSettings.proxy.port),
									type: parseInt(this.#clientSettings.proxy.link.match(/\d/g)[0]),
									userId: this.#clientSettings.proxy.user,
									password: this.#clientSettings.proxy.password
								},
								command: 'connect',
								destination: { // mc server
									host: settings.host,
									port: 25565
								}
							}, (err, info) => {
								if(err) {
									console.log(`Socket Creation Error: `.red, err.message);
									// Test Proxy
									console.log('[PROXY]'.blue, 'Testing Proxy...')
									checkProxy({
									  testHost: this.#clientSettings.host, // put your ping server url here
									  proxyIP: this.#clientSettings.proxy.ip, // proxy ip to test
									  proxyPort: parseInt(this.#clientSettings.proxy.port), // proxy port to test
									  proxyUsername: this.#clientSettings.proxy.user,
									  proxyPassword: this.#clientSettings.proxy.password,
									  localIP: '45.152.113.119', // local machine IP address to test
									  connectTimeout: 6, // curl connect timeout, sec
									  timeout: 10, // curl timeout, sec
									  websites: [
									    {
									      name: 'yandex',
									      url: 'http://www.yandex.ru/',
									      regex: /yandex/gim, // expected result - regex
									
									    },
									    {
									      name: 'google',
									      url: 'http://www.google.com/',
									      regex: function(html) { // expected result - custom function
									        return html && html.indexOf('google') != -1;
									      },
									    },
									    {
									      name: 'amazon',
									      url: 'http://www.amazon.com/',
									      regex: 'Amazon', // expected result - look for this string in the output
									    },
									
									  ]
									}).then(function(res) {
										console.log('final result', res);
									}, function(err) {
									  console.log('[PROXY REJECTED]'.bgRed, err);
									});
									
									// Retry
									return;
								}
								client.on('connect', function () {
								  console.log('[PROXY]'.blue.dim, 'Socket connected'.green.dim)
								})
								client.on('disconnect', function (packet) {
								  console.log('[PROXY]'.blue.dim, 'Socket disconnected: '.red.dim + packet.reason.red)
								})
								client.on('packet', (data ,packetMeta)=>{
									if(packetMeta && packetMeta.name && packetMeta.name === 'kick_disconnect')
										console.log('[PROXY]'.blue.dim, 'Kicked by the server'.red.dim, 'Reason: '.blue, JSON.stringify(data).red.dim);
								})
								client.on('end', function (r) {
									console.log('[PROXY]'.blue.dim, 'Server closed connection with Proxy'.red.dim, r.yellow);
									Client.connected = false;
					    			if( (r === 'socketClosed' || r === 'keepAliveError' || r === 'disconnect.quitting') ){ 
										// Reconnect
					    				// Check Proxy list?????????
					    				console.log('[CLIENT]'.gray, 'Reconnecting'.yellow.dim)
					    				Client.createBot();
					    			}
								})
								client.setSocket(info.socket);
								client.emit('connect')
							})
						}
						
					})
					break;
				case 'http':
					settings.client = mc.createClient({
						agent: new proxyAgent.ProxyAgent( this.#clientSettings.proxy.link),
						username: settings.username,
						password: settings.password,
						auth: settings.auth,
						version: '1.17.1',
						host: settings.host,
						connect: client =>{
							const req = http.request({
							    host: this.#clientSettings.proxy.ip,
							    port: this.#clientSettings.proxy.port,
							    method: 'CONNECT',
								path: `${settings.host}:${25565}`,
							})
							req.end()
							
							req.on('connect', (res, stream) => {
								client.on('connect', function () {
								  console.log('[PROXY]'.blue.dim, 'Socket connected'.green.dim)
								})
								client.on('disconnect', function (packet) {
								  console.log('[PROXY]'.blue.dim, 'Socket disconnected: '.red.dim + packet.reason.red)
								})
								client.on('packet', (data ,packetMeta)=>{
									if(packetMeta && packetMeta.name && packetMeta.name === 'kick_disconnect')
										console.log('[PROXY]'.blue.dim, 'Kicked by the server'.red.dim, 'Reason: '.blue, JSON.stringify(data).red.dim);
								})
								client.on('end', function (r) {
									console.log('[PROXY]'.blue.dim, 'Socket Closed'.red.dim, toString(JSON.stringify(r)).yellow);
									Client.connected = false;
					    			if( (r === 'socketClosed' || r === 'keepAliveError' || r === 'disconnect.quitting') ){ // Reconnect
					    				setTimeout(()=>{
											console.log('[CLIENT]'.gray, 'Reconnecting'.yellow.dim)
					    					Client.createBot();
										}, 120000)
					    			}
								})
							    client.setSocket(stream)
								client.emit('connect')
							})
						},
						agent: new proxyAgent.ProxyAgent( this.#clientSettings.proxy.link),
					})
						
					break;
			}
		} else {
			this.ready()
				.then(()=>{
					this.on('end', function (r) {
						console.log('[CLIENT]'.gray, 'Socket Closed'.red.dim, toString(JSON.stringify(r)).yellow);
						Client.connected = false;
					    if( (r === 'socketClosed' || r === 'keepAliveError' || r === 'disconnect.quitting') ){ // Reconnect
					    	setTimeout(()=>{
								console.log('[CLIENT]'.gray, 'Reconnecting'.yellow.dim)
					    		Client.createBot();
							}, 120000)
					    }
					})
				})
		}
		//settings.hideErrors = true;
		this.bot = mineflayer.createBot(settings);
		this.bot.on('connect', function () {
			console.log('[CLIENT]'.gray, 'connected'.green.dim)
		})
		this.bot.once('login',()=>{
			Client.connected = true;
			console.log(`${"[CLIENT]".gray} ${this.bot.username.blue.dim.bold} ${"successfully spawned into server".green.dim}`);
		});
		
		this.bot.on('resourcePack', (url, hash)=>{
			Client.connected && Client.bot.acceptResourcePack();
		});
		
		this.#clientSettings.autoRun && this.#clientSettings.autoRun.length && this.#clientSettings.autoRun.forEach(cmdName=>{
			// Auto-run Commands Here..?;
		});
		
		// if the state is not saved, reload the connecting functions;
		//!this.#clientSettings.saveState && 
		(()=>{
			Object.keys(this.#events.on).forEach(key=>{
				this.#events.on[key].forEach(f=>{
					this.bot.on(key, f)
				})
			})
			
			Object.keys(this.#events.once).forEach(key=>{
				this.#events.once[key].forEach(f=>{
					this.bot.once(key, f)
				})
			})
		})()
	}
	disconnect(){
		if( this.connected)
			this.bot.quit();
	}
	async ready(){
		while(!this.connected)
			await new Promise(r=> setTimeout(r, 40));
		return 1;
	}
	
	constructor( settings){
		
		console.clear();
		this.#clientSettings = settings;
		this.createBot();
		this.ready()
			.then(()=>{
				// Init constant user input.
				let rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				})
				
				this.cmd.Input(rl);
			})
	}
}






























