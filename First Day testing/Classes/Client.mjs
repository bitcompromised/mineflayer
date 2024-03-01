class clientMessageUser{
	name;
	tags = [];
	rank;
	gang;
	
	setName( name){
		this.name = name;
	}
	setTags( tags){
		this.tags = tags;
	}
	setSystem(){
		this.name = "SYSTEM";
		this.system = true;
		this.setTags(false);
	}
}

function MessageParser(jsonMsg, sender){
	let user = new clientMessageUser;
	let content;// = jsonMsg.extra ? jsonMsg.extra.map( cm =>cm.text).join("").replaceAll(/§\w|§\d/g,"") : jsonMsg.text.replaceAll(/§\w|§\d/g,"");
	
	if(jsonMsg.extra){
		let sectionedContent = jsonMsg.extra.filter(msg=> msg.text !== '')
			.map(msg=> msg.text.replaceAll(/§\w|§\d/g,""));
		let fullContent = sectionedContent.join("");
		content = fullContent;
		
		if(/»/.test(fullContent)) {
			// Potentially a user message
			let userSection = sectionedContent.filter(msg=>/»/.test(msg))[0];
			user.setName(userSection.replace(" » ", ""));
			
			content = sectionedContent.slice( sectionedContent.indexOf( userSection)+1).join("");
			
			if(sectionedContent.indexOf(userSection) !== 0){
				let tagSection = sectionedContent.slice(0, sectionedContent.indexOf(userSection)).join("");
				if(/\[[^\[]+\]/g.test(tagSection)) {
					user.setTags(tagSection.match(/\[[^\[]+\]/g));
				}
			}
			else user.setTags(false);
		}
		else user.setSystem();
		
	} else {
		content = jsonMsg.text.replaceAll(/§\w|§\d/g,"");
	}
	
	if(sender === "game_info" || !user || user.name === " » ") user.setSystem();
	return {
		sender: sender,
		user,
		content
	}
}

export default class Client {
	bot;
	
	busy = false;
	
	leftClick = (slot) => this.bot.simpleClick.leftMouse(slot);
	rightClick = (slot) => this.bot.simpleClick.rightMouse(slot);
	on = (event, callback) => this.bot.on( event, callback);
	once = (event, callback) => this.bot.once( event, callback);
	onMessage = (callback) => this.bot.on("message", (jsonMsg, position, sender, verified) =>{
		callback(MessageParser(jsonMsg, position, sender, verified))
	})
	moveTo = async (vec3) => {
		
	};
	lookAt = async (pos) => {
		if (pos.position) pos = pos.position;
	}
	dig = async () => this.bot.dig(target, 'raycast');
	constructor( bot){
		this.bot = bot;
		bot.on('kicked', (reason, loggedIn) => {
			console.log(`Bot kicked for ${reason}`)
		})
		bot.on('end', (reason) => {
			console.log(`Session has ended with reason: ${reason}`);
		})
		bot.on('error', console.log)
	}
}