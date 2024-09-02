(()=>{
	return	{
		makeBusy: false,
		cmd: "User",
		alias: ['username', 'me', 'whoami'],
		usage: "User",
		description: "Outputs the clients username",
		handler: async function(sender){
			console.log(sender.bot.username);
		}
	}
})()
