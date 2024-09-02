(()=>{
	return	{
		makeBusy: false,
		cmd: "crash",
		alias: ['crashbot'],
		usage: "",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			/*setTimeout(()=>{
				sender.bot.chat('/crash');
			}, 30000)*/
			let crashRunning = true;
			let betPlaced = false;
			
			let lastEnd = null;
			
			sender.bot.on('windowOpen', async (window)=>{
				if(window.title.value.replaceAll(/(§\d|§\w)/g, '') === 'Crash'){
					let phase = null;
					while(window === sender.bot.currentWindow){
						let slots = window.slots
						if(!slots[4]){
							sender.bot.chat('/crash')
							return;
						}
						let join_leave = sender.utils.parseNBT(slots[4].nbt);
						//console.log(join_leave, stats)
						//let str = JSON.stringify(join_leave);
						
						if (join_leave.lore[0].match(/cash out/)) {
							// 1.05 = 1.08-1.09
							// 
							if( Number(join_leave.name.replace('x', '')) >= 1.20 && betPlaced){
								//console.log('Cashing out!');
								await window.withdraw( slots[4].type, null, slots[4].count, null );
								betPlaced = false
							}
							
						} else if (join_leave.lore[0].match(/lost/)) {
							betPlaced && console.log('Lost', join_leave.name);
							betPlaced = false;
						} else if (join_leave.lore[0].match(/won/)) {
							betPlaced && console.log('Won', join_leave.name);
							betPlaced = false;
						} else if( join_leave.lore.includes('Click here to bet')) {
							if(crashRunning && !betPlaced){
								//console.log('Placing Bet')
								await window.withdraw( slots[4].type, null, slots[4].count, null );
								await new Promise(r=>setTimeout(r, 1500));
								sender.bot.chat( 1000000000+sender.utils.random(1,9));
								betPlaced = true;
							}
							
							// Bet
						} else if ( join_leave.lore.includes('Restarting...')){
							// ...
							if(betPlaced)
								betPlaced = false;
							if(lastEnd !== join_leave.name){
								lastEnd = join_leave.name;
								console.log('Game ended at', lastEnd);
							}
							
						} else if ( join_leave.lore.includes('Wait for the next game to bet')){
							let state = slots[4].nbt.value.display.value['ViaVersion|Protocol1_13To1_12_2|Name'].value;
							if( phase != state.match(/§\w/g)[0])
								phase = state.match(/§\w/g)[0];
								//econsole.log('new Phase: ', tempVar, join_leave)
							
							//if()
							//§a = green?
							//§e = yellow
							//§c = red
							// Game is running
							//console.log(join_leave)
							//console.log()
						}
						
						await new Promise(r=>setTimeout(r, 40));
					}
				}
			})
			sender.bot.chat('/crash');
		}
	}
})()
