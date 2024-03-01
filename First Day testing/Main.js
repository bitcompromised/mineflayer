import Client from './Classes/Client.mjs'
import readline from 'readline';
import mineflayer from 'mineflayer';
import * as pathfind from 'mineflayer-pathfinder';


const matches = ( string, ...list) => list.includes(string);
const seenPlayers = new Map();
let reading = false;
let curWindow = null;


const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: 'bigtoker443', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
});

bot.loadPlugin(pathfind.pathfinder)

let client = new Client( bot);

client.on('entitySpawn', (entity)=>{
	if(entity.type === 'player'){
		if(!entity.username){
			//console.log("INVIS spawned near me!");
			entity.username = "INVIS";
		}
		if(!seenPlayers.has(entity.username)){
			seenPlayers.set( entity.username, 1);
			//console.log(`${entity.username} spawned near me`);
		} else{
			seenPlayers.set( entity.username, seenPlayers.get( entity.username) + 1);
			//console.log(`${entity.username} spawned near me ${seenPlayers.get( entity.username)} times`);
		}
	}
})

client.on('windowOpen', (window)=>{
	curWindow = window;
})

client.once('spawn', ()=>{
	console.clear();
	console.log(`Logged in as ${bot.username}`);
	if(Math.floor(bot.entity.position.x) === -17 && Math.floor(bot.entity.position.y) == 53){
		console.log(`[Client] At default spawn position. Moving to enable chatting.`)
		bot.setControlState("forward", true);
		setTimeout(()=>{
			bot.setControlState("forward", false);
			console.log(`[Client] Moved out of spawn`);
		}, 3200)
	}
	ProcessCmd();
})

client.onMessage((msgData)=>{
	let tags = msgData.user.tags;
	let name = msgData.user.name;
	let msg = msgData.content;
	
	if( !tags && name.match("MSG")) {
		console.log("Private Message");
		console.log(`${tags ? `${tags.join("")} ` : ''}${name} > ${msg}`)
	} else {
		//console.log(`${tags ? `${tags.join("")} ` : ''}${name} > ${msg}`)
	}
	
});
/*client.on("entitySwingArm", async (entity) => {
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
})*/

function ProcessCmd(){
	reading = true;
	let rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	})
	rl.question(`CMD:`, (cmd) => {
		if( cmd === 'say'){
			rl.question("say what:", (content)=>{
				client.bot.chat(content);
				rl.close();
				ProcessCmd();
			})
		} else if ( cmd === 'goto'){
			/*rl.question("follow who:", async (username)=>{
				client.busy = true;
				while(client.busy){
					let entity = Object.values(client.bot.entities).filter(e=>e.username === username)[0];
					if ( entity){
						let lookPos = entity.position;
						
						while( bot.entity.position.distanceTo(lookPos) > 2){
							//lookPos = entity.position; // <---- follows you around
							await bot.lookAt(lookPos);
							//console.log(bot.entity.position, entity.position, bot.entity.position.distanceTo(entity.position))
							if(!bot.controlState.forward) bot.setControlState("forward", true);
							await new Promise( r=> setTimeout(r, 150));
						}
						bot.setControlState("forward", false);
						client.busy = false;
					} else {
						await new Promise( r=> setTimeout(r, 1250));
					}
				}
				rl.close();
				ProcessCmd();
			})*/
			rl.question("follow who:", async (username)=>{
				const defaultMove = new pathfind.Movements(bot);
				
				const entity = Object.values(client.bot.entities).filter(e=>e.username === username)[0];
				
				if(!entity) return;
				
				const p = entity.position

			    bot.pathfinder.setMovements(defaultMove)
			    bot.pathfinder.setGoal(new pathfind.default.goals.GoalNear(p.x, p.y, p.z, 1))
				
				rl.close();
				ProcessCmd();
			})
			
		} else if ( cmd === 'showinv'){
			client.busy = false;
			let inventory = client.bot.inventory;
			let nbt_inventory = inventory.slots.map((value,index)=>{
				if(value){
					let item = {
						slot: index,
						item: value.name,
						id: value.type,
						count: value.count,
						enchants: value.enchants ?? null,
						o: value,
					}
					
					if( value.customLore) {
						item.lore = value.customLore.map(json=>{
							return JSON.parse(json).extra.map(et=>et.text).join("");
						}).join("");
					}
					if(value.nbt && value.nbt.value && value.nbt.value.display && value.nbt.value.display.value){
						item.name = Object.values(value.nbt.value.display.value)[1].value.replaceAll(/§\w|§\d/g,"");
						try {
							let unJson = JSON.parse(item.name);
							item.name = unJson.extra[0].extra.map(i=>i.text).join("")
						} catch(err){
							console.log(err);
						}
					}
					if(value.enchants){
						item.enchants = JSON.stringify(value.enchants)
					}
					return item;
				} else {
					return {
						slot: index,
						item: null,
						id: null,
						count: null,
						nbt: "",
					}
				}
			})
			console.log(nbt_inventory);
			rl.close();
			ProcessCmd();
		} else if (cmd === "ah"){
			client.bot.chat("/ah");
			rl.close();
			ProcessCmd();
		} else if (cmd === 'wclose'){
			curWindow.close();
			rl.close();
			ProcessCmd();
		} else if (cmd === 'winfo'){
			console.log(curWindow);
			rl.close();
			ProcessCmd();
		} else if (cmd === 'nearby'){
			console.log(Object.values(client.bot.entities).filter(e=>e.type === 'player').map(e=>e.username));
			rl.close();
			ProcessCmd();
		}
		
		else {
			rl.close();
			reading = false;
			ProcessCmd();
		}
	});
}

