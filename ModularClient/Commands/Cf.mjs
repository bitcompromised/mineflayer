(()=>{
	return	{
		makeBusy: false,
		cmd: "say",
		args: "string",
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			if(!sender.settings.hasOwnProperty('cfbot')){
				// Initiate CF Bot System
				sender.on((message)=>{
					
				})
			}
			if(sender.settings['cfbot']){
				sender.settings['cfbot'] = false;
			} else {
				sender.settings['cfbot'] = true;
				
				// Initiate Process CF: sender.chat()
			}
		}
	}
})()
