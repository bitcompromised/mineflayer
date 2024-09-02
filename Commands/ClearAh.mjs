(()=>{
	return	{
		makeBusy: false,
		cmd: "clearah",
		alias: ['ahclear', 'ahredeem', 'ahcollect', 'collectah'],
		usage: "ahsniper",
		description: "Collects items from /ah",
		handler: async function(sender, args){
			sender.settings.ahclear = true;
			console.log(sender.settings.ahclear)
		}
	}
})()
