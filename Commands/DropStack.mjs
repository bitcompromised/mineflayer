(()=>{
	return	{
		makeBusy: true,
		cmd: "dropstack",
		alias: ['drop', 'dropitem', 'dropslot'],
		args: "string",
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			if (!sender.bot.inventory.slots[args[0]]) return;
			sender.bot.tossStack(sender.bot.inventory.slots[args[0]]);
		}
	}
})()
