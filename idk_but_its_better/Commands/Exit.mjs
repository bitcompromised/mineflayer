(()=>{
	return {
		name: "exit",
		alias: ['quit'],
		usage: "exit <reason>",
		description: "exit the bot 'gracefully'",
		
		load: false,
		run: (client, args)=>{
			if(!client.connected)
				return console.log('[CLIENT]'.gray, 'not connected to server'.red.dim)
			client.bot.quit( args.join(' ') || 'bot.quit');
		}
	}
})();