(()=>{
	return {
		name: "hand",
		alias: ['showhand', 'inhand'],
		usage: "hand <null>",
		description: "Shows the item currently in your hand",
		
		load: false,
		run: (client, args)=>{
			if(!client.connected)
				return console.log('[CLIENT]'.gray, 'not connected to server'.red.dim)
			console.log( client.bot.heldItem);
		}
	}
})();