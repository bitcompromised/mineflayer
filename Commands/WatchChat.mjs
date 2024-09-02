(()=>{
	return	{
		makeBusy: false,
		cmd: "watchchat",
		alias: ['chatspy'],
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			sender.bot.on('message', async( jsonMessage, senderr)=>{
					let details = sender.utils.parseMessage( jsonMessage, senderr);
					//console.log(details);
					if(
						!/buy.purpleprison.net/.test(details.text) &&
						!/View a players information/.test(details.text) &&
						!/Check out our Store/.test(details.text) &&
						!/Turn off chat messages/.test(details.text) &&
						!/just voted! Vote on all links/.test(details.text) &&
						!/Bet your money - /.test(details.text) &&
						!/discord.gg/.test(details.text)
					)
						globalThis['messages'] === undefined 
							? 
								(()=>{globalThis['messages'] = [ `${details.tags.join("")} ${details.sender}: ${details.text}`]})()
							:
								(()=>{globalThis['messages'].push(`${details.tags.join("")} ${details.sender}: ${details.text}`)})();
					if(globalThis['messages'] && globalThis['messages'].length >= 15){
						sender.cmds.log('message', globalThis['messages'] .join (`\n`));
						globalThis['messages'] = [];
					}
				}
			)
		}
	}
})()
