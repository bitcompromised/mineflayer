(()=>{
	return	{
		makeBusy: false,
		cmd: "adsnipe",
		alias: ['adsniper'],
		usage: "adsnipe <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			console.log("Setting up AHSniper");
			sender.on("windowOpen", async (window) => {
				let title = sender.utils.sanitizeText(window.title.value);
				
				let wantedSlots = 4;
				
				
				if(/Player Ads/.test(title)){
					for( let i = 0; i < wantedSlots; i++){
						let item = window.slots[i];
						let info = sender.utils.parseNBT( item.nbt);
						if(info.lore.filter(l=>l.match(/Click here to purchase an ad/)).length){
							console.log('Buying #1 adspot');
							(async ()=>{await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null)})();
							sender.bot.chat('#1 op shop');
						} else if (info.lore.filter(l=>l.match(/Click here to purchase an ad/)).length){
							console.log('Buying #2 adspot');
							(async ()=>{await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null)})();
							sender.bot.chat('#1 op shop');
						}
					}
				} else if (/Pick Ad Style/.test(title)){
					return await window.withdraw( slots[1].type, slots[1].metadata ?? null, slots[1].count, slots[1].nbt ?? null)
				} else if (/Choose a Plot/.test(title)){
					return await window.withdraw( slots[0].type, slots[0].metadata ?? null, slots[0].count, slots[0].nbt ?? null)
				}
			})
			setInterval(() => {
				sender.bot.chat("/ad");
			}, 250)
		}
	}
})()
