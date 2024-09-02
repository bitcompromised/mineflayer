(()=>{
	return	{
		makeBusy: false,
		cmd: "search",
		alias: ['s'],
		usage: "searchblock < item | block | entity > <name>",
		description: "Outputs the matching block names ex: air, iron_block",
		handler: async function(sender, args){
			switch( args[0]){
				case "block":
					console.log(Object.keys(sender.bot.registry.blocksByName).filter(name=>{
						if(name.match(args[1])){
							return true;
						}
					}).map(item_name=>{
						let rItem = sender.bot.registry.blocksByName[item_name];
						return {
							id: rItem.id,
							name: rItem.name,
							displayName: rItem.displayName,
							hardness: rItem.hardness,
							stackSize: rItem.stackSize,
							material: rItem.material
						}
					}))
					break;
				case "item":
					console.log(Object.keys(sender.bot.registry.itemsByName).filter(name=>{
						if(name.match(args[1])){
							return true;
						}
					}).map(item_name=>{
						let rItem = sender.bot.registry.itemsByName[item_name];
						return {
							id: rItem.id,
							name: rItem.name,
							displayName: rItem.displayName,
							hardness: rItem.hardness,
							stackSize: rItem.stackSize,
							material: rItem.material
						}
					}))
					break
			}
			
		}
	}
})()
