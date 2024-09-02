(()=>{
	return	{
		makeBusy: false,
		cmd: "equip",
		alias: ['sethand'],
		args: "string",
		usage: "equip <slot>",
		description: "Equips item to bots hand",
		handler: async function(sender, args){
			if( !args[0])
				return;
			let o = sender.bot.inventory.slots[Number(args[0])];
			if (!o) {
				sender.cmds.logChannels.warn("[CMD] Cannot equip slot. Slot is empty")
			} //console.log("No Item in that slot");
			else sender.bot.equip(o, "hand");
		}
	}
})()
