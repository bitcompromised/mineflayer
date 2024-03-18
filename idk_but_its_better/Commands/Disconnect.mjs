(()=>{
	return {
		name: "disconnect",
		alias: ['leaveserver', 'leave'],
		usage: "disconnect <...msg>",
		description: "Disconnect the bot from the current server",
		
		load: false,
		run: (client, args)=>{
			if(!client.connected)
				return console.log('[CLIENT]'.gray, 'not connected to server'.red.dim)
			client.bot.end( args.join(''));
		}
	}
})();