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
export default {
	sanitizeText,
	parseNBT: (item) => {
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
							newitem.name = sanitizeText(name.value);
						}
					}
					if (display.value.hasOwnProperty('ViaVersion|Protocol1_14To1_13_2|Lore')) {
						let lore = display.value['ViaVersion|Protocol1_14To1_13_2|Lore']
						//console.log(`display.value['ViaVersion|Protocol1_14To1_13_2|Lore'] = ${JSON.stringify( lore) }`)
						if (lore.type === 'list') {
							if (lore.value.type === 'string') {
								newitem.lore = lore.value.value.map(t => sanitizeText(t));
							}
						}
						if (newitem.lore.filter(l => typeof (l) === 'string' && l.match(/Price:/)).length > 0) {
							newitem.price = Number(newitem.lore.filter(l => l.match(/Price:/))[0].match(/\d+,\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+|\d+,\d+,\d+|\d+,\d+|\d+/g)[0].replaceAll(",", ""))
						}
					}
				}
			}
		} else {
			console.log(`[ItemParse] ???? ${JSON.stringify(item)}`);
		}

		//console.log("newitem: ", newitem);
		return newitem;
	},
	parseMessage: (msg)=>{
		let message = {
			tags: [],
			sender: null,
			text: null,
		}
		if(msg.extra instanceof Array)
			message.text = msg.extra.map(o=>sanitizeText(o.text)).join("")
		else
			message.text = sanitizeText(msg.text)
		if(message.text.match(/»/) && !message.text.match(/PP » /)){
			if(message.text.match(/➛/) && message.text.match(/MSG/)){
				// Private Message
				message.tags.push("[MSG]");
				message.sender = message.text.match(/([a-zA-Z0-9]+) ➛ ([a-zA-Z0-9]+)/)[1];
				message.text = message.text.match(/» (.*)/)[1];
			} else {
				if(message.text.match(/\[[a-zA-Z0-9]+]/)){
					message.tags = message.text.match(/(\[[a-zA-Z0-9]+])/g);
				}
				message.sender = message.text.match(/([a-zA-Z0-9]+) »/) ? message.text.match(/([a-zA-Z0-9]+) »/)[1]: "SERVER";
				message.text = message.text.match(/» (.*)/) ? message.text.match(/» (.*)/)[1] : message.text;	
			}
		} else {
			if(message.text.match(/    TIP: /) || message.text.match(/OBTAIN WITH \/BUY/) || message.text.match(/RESET CRATE/) || message.text.match(/PP » /) || message.text.match(/purpleprison.co/) || message.text.match(/You can claim a free crate key by linking our/) || message.text.match(/WANT A FREE PURPLE CRATE KEY?/) || message.text.match(/purpleprison.net/) || message.text.match(/IS ACTIVE/) || message.text.match(/discord.gg/) || message.text.match(/opened a \w+ crate/) || message.text.match(/Welcome to PURPLE/) || message.text.match(/You can claim a free crate key by liking our/) || message.text.match(/namemc/) || message.text.match(/ has won an \w+ \w+ from /) || message.text.match(/vote for rewards/) || message.text.match(/TIP:/)){
				message.sender = 'SERVER';
				return message;
			} else {
				if(message.text.match(/                              /) || message.text === ' ' || message.text === '    ')
					return message;
				message.sender = message.text.match(/([a-zA-Z0-9]+) »/) ? message.text.match(/([a-zA-Z0-9]+) »/)[1]: "SERVER";
				message.text = message.text.match(/» (.*)/) ? message.text.match(/» (.*)/)[1] : message.text;	
			}
		}
		return message;
	},
	/*parseMessage: (jsonMsg, sender)=>{
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
			text: content
		}
	},*/
	moneyFormat: ( amt)=>{
		let realAmt = Math.abs( amt);
		let letters = [ "", "K", "M", "B", "T", "Q"];
		let letter = "";
		let mult = 1;
		let i = 0;
		while( i < letters.length){
			if ( realAmt/(1000**i) >= 1){
				letter = letters[ i];
				mult = (1000**i);
			}
			i++;
		}
		return ""+ (Math.floor(( amt/ mult)* 10)/ 10)+ letter;
	},
	random: (min, max) => {
	    return Math.floor(Math.random() * (max - min)) + min;
	},
	formatDate: (date) => {
	    let day = date.getDate().toString().padStart(2, '0');
	    let month = (date.getMonth() + 1).toString().padStart(2, '0');
	    let year = date.getFullYear().toString().slice(-2);
	    let hours = date.getHours().toString().padStart(2, '0');
	    let minutes = date.getMinutes().toString().padStart(2, '0');
	    let seconds = date.getSeconds().toString().padStart(2, '0');
	    let milliseconds = date.getMilliseconds().toString().padStart(3, '0');
	
	    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
	},
};
