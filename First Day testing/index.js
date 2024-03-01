import mineflayer from 'mineflayer';
import readline from 'readline';

const matches = ( string, ...list) => list.includes(string);

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const sanitizeText = (msg) => {
	if( !msg) return "";
	let t = "";
	for( let i = 0; i < msg.length; i++){
		if( msg[i] == "§" ){
			i++
		} else {
			t += msg[i]
		}
	}
	return t;
}

const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: '5', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
  // port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // specify (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

let chatSpecialEvents = [
	"BROADCAST",
	"TIP",
	"SUPPLYDROP",
	"MSG"
]

/*bot.on('chat', (username, message, t, raw) => {
	if (matches( username, bot.username, "MSG", "nomore", "nomoredabs", "Cuteey", "TIP", "DUELS", "PP")){
		if( !matches( username, "TIP", "PP", "DUELS"))
			if(matches( username, "MSG")){
					console.log("New Private Message");
				if( message.match("cf 200k")){ // Starter Keyword
					console.log(username, message);
					bot.chat("/cf 200000 heads")
				}
			}
		}
		console.log(`[msg] ${username}: ${message}`);
		if(message.match("cf 200k")) {
			console.log("CF Started?");
			bot.chat("/cf 200000 heads")
		}
	}
)*/

bot.on('message', (jsonMsg, position, sender, verified) =>{
	let rawMessage = {
		user: {
			name: null,
			tag: null,
			gang: null,
			rank: null
		},
		message: null,
		raw: jsonMsg.extra ? sanitizeText(jsonMsg.extra.map( cm =>cm.text).join("")) : sanitizeText(jsonMsg.text),
	}
	if( rawMessage.raw.match("»")){
		//Potentially user sent message?
		// \[([^]]+)\] \s*([a-zA-Z0-9]+) = [Z] GreyGoose385
		// \[([^]]+)\] \[([^]]+)\] \[([^]]+)\] \s*([a-zA-Z0-9]+) = [X][C][Z] GreyGoose385
		//let test = rawMessage.raw.match(/\[([^]]+)\]\s*([a-zA-Z0-9]+)/g);
		//console.log(test);
		
		if( rawMessage.raw.match("MSG")){
			console.log(rawMessage.raw);
			//bot.chat(`/r ${rawMessage.raw}`);
			if(rawMessage.raw.match("run")){
				ProcessCmd()
			}
		}
	}
	//console.log(rawMessage.raw);
})


// Log errors and kick reasons:
bot.on('kicked', (reason, loggedIn) => {
	console.log(`Bot kicked for ${reason}\nLogged in: ${loggedIn}`)
})
bot.on('end', (reason) => {
	console.log(`Session has ended with reason: ${reason}`);
})
bot.on('error', console.log)

function getRenderedEntities(){
	let e = Object.values(bot.entities);
	return ({
		players: e.filter(e=> e.type === 'player'), // type: 'player'
		other: e.filter(e=> e.type === 'other'), // Item Frame
	})
}

function walkTo(vec3){
	
}

const leftClick = (slot) => bot.simpleClick.leftMouse(slot);
const rightClick = (slot) => bot.simpleClick.rightMouse(slot);

function ProcessCmd(){
	let rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	})
	rl.question(`CMD:`, (name) => {
		
		if( name === "say") {
			rl.close();
			let rc = readline.createInterface({
			  input: process.stdin,
			  output: process.stdout,
			})
			rc.question("say what:", (content)=>{
				bot.chat(content);
				rc.close();
			})
		} else if ( name === "equip") {
			rl.close();
			let rc = readline.createInterface({
			  input: process.stdin,
			  output: process.stdout,
			})
			rc.question("equipment id for hand:", ( item)=>{
				let itemO = bot.inventory.items().filter(i=>i.type == item)[0];
				if(!itemO) return;
				bot.equip( itemO);
				rc.close();
			})
		} else if ( name === "viewinv"){
			rl.close();
			console.log(bot.inventory.items())
		} else {
			rl.close()
		}
	});
}

bot.once('spawn', ()=>{
	console.log(`Logged in as ${bot.username}`);
	console.log(getRenderedEntities().players);
	//console.log(bot.entities);
	//console.log(bot.entity);
	bot.chat("[i]");
	setInterval(()=>{
		bot.chat("[i]");
	}, random(65000,78000))
})

bot.on("entitySwingArm", async (entity) => {
	// use to make bot follow ent?
	if (matches(entity.username, 'nomoredabs', 'Cuteey')){
		if(entity.equipment[0] && entity.equipment[0].displayName === "Poppy"){
			let targetBlock = bot.blockAtEntityCursor(entity, 256);
			await bot.lookAt(targetBlock.position);
			bot.setControlState("forward", true);
			while( bot.entity.position.distanceTo(targetBlock.position) > 2){
				await new Promise( r=> setTimeout(r, 250));
			}
			bot.setControlState("forward", false);
		}
	}
})

bot.on("playerCollect", (collector, collected) => {
	
});

bot.on("forcedMove", ()=>{
	console.log("Bot forced to move to", bot.entity.position)
})

bot.on("windowOpen", (window)=>{
	//if(window.items().filter())
	console.log(window.items());
})

