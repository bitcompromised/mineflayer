(()=>{
	return	{
		makeBusy: false,
		cmd: "help",
		alias: ['h'],
		usage: "help <page>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			let cmd = args[0]
			if(sender.cmds.commands[cmd])
				console.log(`cmd: ${cmd} - [${sender.cmds.commands[cmd].alias}]\nusage: ${sender.cmds.commands[cmd].usage}\ndescription:${sender.cmds.commands[cmd].description}\n`)
			else if ( !args[1] || Number(cmd) !== NaN){
				let page = Number(cmd) || 1;
				let e = [];
				Object.keys(sender.cmds.commands).map(c=>{
					if(!e.includes(sender.cmds.commands[c].cmd))
						e.push(sender.cmds.commands[c].cmd);
				})
				console.log("Commands: ", e)
			}
		}
	}
})()
