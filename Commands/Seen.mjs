(()=>{
	return	{
		makeBusy: false,
		cmd: "seen",
		alias: ['allplayers'],
		usage: "seen",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			if(!sender.settings.Seen){
				sender.settings.Seen = Object.keys(sender.bot.players);
				sender.on('playerJoined', (player)=>{
					if(!sender.settings.Seen.includes(player.username))
						sender.settings.Seen.push(player.username);
				})
			} else {
				if(args.length > 0){
					if(args[0] === 'length'){
						console.log(sender.settings.Seen.length);
					}
				} else {
					sender.settings.Seen.forEach(p=>console.log(p))
				}
				
			}
		}
	}
})()
