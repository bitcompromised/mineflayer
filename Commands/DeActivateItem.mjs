(()=>{
	return	{
		makeBusy: false,
		cmd: "deactivate",
		alias: ['unrightclick', 'unuse'],
		usage: "deactivate",
		description: "Activates (right clicks) item",
		handler: async function(sender, args){
			sender.bot.deactivateItem();
		}
	}
})()