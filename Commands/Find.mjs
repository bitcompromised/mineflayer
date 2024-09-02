(()=>{
	return	{
		makeBusy: false,
		cmd: "find",
		alias: ['locate'],
		usage: "find < block | player | entity > < name > < opt: # of entries >",
		description: "Outputs the position of found blocks",
		handler: async function(sender, args){
			let type = args[0];
			let name = args[1];
			let count = args[2] || 1;
			
			if( !type || !name)
				return;
			
			switch(type.toLowerCase()){
				case "block":
					let findBlocks = sender.bot.findBlocks({
						matching: (block) => {
							if (block.name.match(name) || block.displayName.match(name))
								return true;
							return false;
						},
						maxDistance: 256,
						count
					})
					console.log(findBlocks);
					break;
				case "player":
					console.log(Object.values(sender.bot.players).filter(p=>{
						return p.username.match(name)
					}).map(p=>p.entity.position))
					break;
				case "entity":
					let ents = Object.values(sender.bot.entities).filter(e=>{
						return e.name === name || e.displayName === name || e.username === name
					})
					console.log(ents);
					break;
			}
			
		}
	}
})()
