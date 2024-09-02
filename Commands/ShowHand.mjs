(()=>{
	return	{
		makeBusy: false,
		cmd: "hand",
		alias: ['showhand', 'gethand'],
		usage: "hand",
		description: "Outputs the current held item using the log method",
		handler: async function(sender){
			if(sender.bot.heldItem){
				console.log({slot: sender.bot.heldItem.slot,
						nbt: sender.bot.heldItem.nbt ? sender.utils.parseNBT( sender.bot.heldItem.nbt) : null,
						name: sender.bot.heldItem.name,
						count: sender.bot.heldItem.count})
			}
		}
	}
})()