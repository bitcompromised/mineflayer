(()=>{
	return {
		name: "coinflip",
		alias: ['cf'],
		usage: "cf <bool>",
		description: "Say the msg using the bot.chat method",
		
		load: async ( client)=>{
			// Load Coinflip && Coinflip Spoofer settings
			
			while( true){
				if( !client.connected){
					await new Promise(r=> setTimeout(r, 15000));
					continue;
				}
				let coinflip = await client.bot.awaitMessage(/You \w+ your bet against .* for \$/);
				console.log(coinflip);
			}
		},
		run: (client, args)=>{
			
		}
	}
})();