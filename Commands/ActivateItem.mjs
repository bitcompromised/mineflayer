(()=>{
	return	{
		makeBusy: false,
		cmd: "activate",
		alias: ['rightclick', 'use'],
		usage: "activate",
		description: "Activates (right clicks) item",
		handler: async function(sender, args){
			sender.bot.activateItem();
		}
	}
})()
