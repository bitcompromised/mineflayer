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



export const utils = {
	nbtParser: (item) => {
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
	
	messageParser: (jsonMsg, sender)=>{
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
};
