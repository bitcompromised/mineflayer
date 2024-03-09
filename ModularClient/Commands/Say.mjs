(()=>{
	return	{
		makeBusy: false,
		cmd: "say",
		args: "string",
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			sender.bot.chat( args);
		}
	}
})()
