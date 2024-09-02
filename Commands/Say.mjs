(()=>{
	return	{
		makeBusy: false,
		cmd: "say",
		alias: ['chat'],
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			sender.bot.chat( args.join(" "));
		}
	}
})()
