const colors = global.colors || await import('colors'); global.colors = colors;
const readline = global.readline || await import('readline'); global.readline = readline;
const process = global.process || await import('node:process'); global.process = process;
const client = (await import('./Classes/Client.mjs')).Client;

const yes = ['y','yes','ye','1',1];
const no = ['n','no','ne','0',0];
let random = (min, max) => {
	    return Math.floor(Math.random() * (max - min)) + min;
	}

async function getClientSettings(){
	let ClientSettings = {
		
	}
	function getUserInput( question, Default){
		return new Promise(r=>{
			let rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			})
			rl.question( question, async ( res)=>{
				rl.close();
				r(res);
			});
		})
	}
	async function getValidProxy( def){
		let proxy = def || await getUserInput("proxy link: ", null);
		if( !/(\w+|\w+\d):\/\/([\w\d_]+):([\w\d_]+)@\d+\.\d+\.\d+\.\d+:\d+/.test(proxy) && !/([\w\d_]+)@\d+\.\d+\.\d+\.\d+:\d+/.test(proxy) && !/\w:\/.*[.txt|.json]/.test(proxy)){
			// not (u:p@ip:port) && not (ip:port) && not (c:/.txt)
			let manualInput = await getUserInput(("Invalid Proxy".red + " [1: manual input, 2: skip, 3: reneter 4: retry-proxy]: "), 1)
			switch( manualInput){
				case "1":
					// Manual Entry
					break;
				case "2":
					//Skip
					return;
				case "3":
					// Re-enter Proxy
					break;
				case "4":
					// Keep for when testing proxies is active
					break;
			}
			return (await getValidProxy());
		} else {
			if(/[a-zA-Z0-9]+:[a-zA-Z0-9]+@/.test(proxy)) {
					// Password Protected
				let [link, type, username, password, ip, port] = /(\w+|\w+\d):\/\/([\w\d_]+):([\w\d_]+)@(\d+\.\d+\.\d+\.\d+):(\d+)/g.exec(proxy);
				type = type.match(/[a-zA-Z]+/g)[0]
				return {
					link,
					type,
					username,
					password,
					ip,
					port
				}
			} else {
				let [link, type, ip, port] =  /(\w+|\w+\d):\/\/(\d+\.\d+\.\d+\.\d+):(\d+)/g.exec(proxy);
				type = type.match(/[a-zA-Z]+/g)[0]
				return {
					link,
					type,
					ip,
					port
				}
			}
		}
	}
	if( process.argv.length >= 3){
		// has Process Params
		const args = process.argv.splice(2);
		if( args.length === 2){
			// username, server
			ClientSettings.username = args[0];
			ClientSettings.host = args[1];
			let usingProxy = await getUserInput("Using proxy? ", 'n');
			// Load Proxy Settings
			if( yes.includes(usingProxy.toLowerCase())){
				let proxy = await getValidProxy(); 
				if( proxy)
					if(['socks5', 'socks4', 'http', 'https'].includes(proxy.type))
						ClientSettings.proxy = proxy}
		} else if (args.length >= 3){
			// username, server, [proxy, ...autoRun], ...autoRun
			ClientSettings.username = args[0];
			ClientSettings.host = args[1];
			if( /(\w+|\w+\d):\/\/([\w\d_]+):([\w\d_]+)@\d+\.\d+\.\d+\.\d+:\d+/.test( args[2]) || /([\w\d_]+)@\d+\.\d+\.\d+\.\d+:\d+/.test( args[2]))
				ClientSettings.proxy = await getValidProxy( args.splice(2,1));
			ClientSettings.autoRun = args.splice(2);
			ClientSettings.auth = 'microsoft';
		}
	} else {
		console.log('Correct Usage: node <main.js> username <server> <...autorun>')
		console.log('node <main.js> <username> <server> <proxy| ...autorun>')
		// no Process Params;
		let authType = await getUserInput("Auth type? 1) microsoft 2) user: ", '1');
		
		ClientSettings = {
			auth: (authType === 'microsoft' || authType === 'm' || authType === 'link' || authType === 'code' || authType === '1') ? 'microsoft' : 'email',
			username: await getUserInput("User: ", ''),
			password: (authType === 'microsoft' || authType === 'm' || authType === 'link' || authType === 'code' || authType === '1') === false ? await getUserInput("Password: ", '') : null,
			host: await getUserInput("Server: ", '')
		}
		//ClientSettings.auth = (authType === 'microsoft' || authType === 'm' || authType === 'link' || authType === 'code' || authType === '1') ? 'microsoft' : 'email';
		//ClientSettings.username = await getUserInput("User: ", '');
		//ClientSettings.password = (authType === 'microsoft' || authType === 'm' || authType === 'link' || authType === 'code' || authType === '1') === false ? await getUserInput("Password: ", '') : null;
		//ClientSettings.host = await getUserInput("Server: ", '');

		// Load Proxy Settings
		if( yes.includes((await getUserInput("Using proxy? ", 'n')).toLowerCase())){
			let proxy = await getValidProxy(); 
			if( proxy)
				if( ['socks', 'http', 'https'].includes(proxy.type))
					ClientSettings.proxy = proxy}
	}
	return ClientSettings;
}

let parseNBT = (item) => {
	let newitem = {};
	if (item.type === 'compound') {
		let lvl1_info = item.value;
		if (lvl1_info.display) {
			let display = lvl1_info.display;
			if (display.type === 'compound') {
				if (display.value.hasOwnProperty('ViaVersion|Protocol1_13To1_12_2|Name')) {
					let name = display.value['ViaVersion|Protocol1_13To1_12_2|Name'];
					//console.log(`display.value['ViaVersion|Protocol1_13To1_12_2|Name'] = ${JSON.stringify( name) }`)
					if (name.type === 'string') {
						newitem.name = name.value.replaceAll(/§\w/g, '');
					}
				}
				if (display.value.hasOwnProperty('ViaVersion|Protocol1_14To1_13_2|Lore')) {
					let lore = display.value['ViaVersion|Protocol1_14To1_13_2|Lore']
					//console.log(`display.value['ViaVersion|Protocol1_14To1_13_2|Lore'] = ${JSON.stringify( lore) }`)
					if (lore.type === 'list') {
						if (lore.value.type === 'string') {
							newitem.lore = lore.value.value.map(t => t.replaceAll(/§\w/g, ''));
						}
					}
					if (newitem.lore.filter(l => typeof (l) === 'string' && l.match(/\$/)).length > 0) {
						newitem.price = Number(newitem.lore.filter(l => l.match(/\$/))[0].match(/\d+,\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+|\d+,\d+,\d+|\d+,\d+|\d+/g)[0].replaceAll(",", ""))
					}
				}
			}
		}
	} else {
		console.log(`[ItemParse] ???? ${JSON.stringify(item)}`);
	}

		//console.log("newitem: ", newitem);
	return newitem;
}
async function Main(){
	let settings = await getClientSettings();
	settings.saveState = true;
	if(!settings.proxy);
		//process.exit(696969);
	let Client = new client( settings);
	
	await Client.ready();
	
	
	Client.on('spawn', ()=>{
		console.log('Hi');
	});
}

Main();





















