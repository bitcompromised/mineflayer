(()=>{
	return	{
		makeBusy: false,
		cmd: "showinventory",
		alias: ['inventory', 'inv', 'showinv'],
		args: null,
		usage: "showinventory",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			console.log(sender.bot.inventory.slots.map((slot, index)=>{
				
				if( !slot )
					return; //{slot: index, present: false }
				else
					return {
						slot: slot.slot,
						nbt: slot.nbt ? sender.utils.parseNBT( slot.nbt) : null,
						name: slot.name,
						count: slot.count,
						//present: true
					}
			}).filter(entry=>entry !== undefined))
		}
	}
})()
