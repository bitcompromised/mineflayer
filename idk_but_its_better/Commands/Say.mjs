(()=>{
	return {
		name: "say",
		alias: ['chat'],
		usage: "say <...msg>",
		description: "Say the msg using the bot.chat method",
		
		load: false,
		run: (client, args)=>{
			if( client.connected)
				client.bot.chat( args.join(' '));
			console.log(args.join(' '));
		}
	}
})();