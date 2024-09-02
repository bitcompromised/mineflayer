(()=>{
	return	{
		makeBusy: false,
		cmd: "advertise",
		alias: ['ads', 'advert'],
		usage: "ads (toggle)",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender){
			if(!sender.settings.hasOwnProperty('adverts')){
				sender.bot.chat('[i]');
				setInterval( ()=>{
					if(sender.settings.adverts && sender.bot && sender.bot.chat)
						sender.bot.chat('[i]');
				}, sender.utils.random(61000,78000))
			}
			sender.settings.adverts = ! sender.settings.adverts
			console.log(`[ADS] ${sender.settings.adverts}`)
		}
	}
})()
