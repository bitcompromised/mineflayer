(()=>{
	return	{
		makeBusy: true,
		cmd: "checkplots",
		alias: ['findshops'],
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			if(!sender.settings.Seen){
				sender.settings.Seen = Object.keys(sender.bot.players);
				sender.on('playerJoined', (player)=>{
					if(!sender.settings.Seen.includes(player.username))
						sender.settings.Seen.push(player.username);
				})
			}
			let amt = sender.settings.Seen.length;
			for(let i = 0/*sender.settings.Seen.indexOf('DerPfarrer')-1*/; i < amt; i++){
				let player = sender.settings.Seen[i]
				let pos = sender.bot.entity.position;
				sender.bot.chat(`/p h ${player}`);
				
				await new Promise(r=>setTimeout(r, 1500));
				
				if (pos.equals(sender.bot.entity.position))
					continue;
				
				// check for plot-shops
				
				let findBlocks = sender.bot.findBlocks({
						matching: (block) => {
							if (block.name.match("sign") || block.displayName.match("sign"))
								return true;
							return false;
						},
						maxDistance: 80,
						count: 9e9
					})
						.map(vec3 => sender.bot.blockAt(vec3, true).getSignText()[0])
						.filter(text => text.match("[Buy Shop]") || text.match("[Sell Shop]"))
						.filter(text=>(
							text.match(player) &&
							text.match('Mine') || 
							text.match('RANKU') || 
							text.match('GOD C') || 
							text.match('PURPL') ||
							text.match('PLOT') ||
							text.match('Scrat') ||
							text.match('BLAST') ||
							text.match('GOD H') ||
							text.match('GOD C') ||
							text.match('GOD L') ||
							text.match('GOD B') ||
							text.match('O: x1') ||
							text.match('Golden A') ||
							text.match('TOKEN') ||
							text.match('PLOT§')
						));
				
				if(findBlocks.length > 0){
					let text = findBlocks.map(shopSign=>shopSign.replaceAll(`\n`,' | '))
					.join(`\n`).replaceAll(`[Sell Shop] |`, '[S]').replaceAll(`[Buy Shop] |`, '[B]').split("");
					
					let messages = text.length/1900;
					
					for(let mi = 0; mi < Math.ceil(messages); mi++){
						mi = text.splice(0, 1899).join("");
						//sender.cmds.log('plotshop', mi);
						sender.ps(mi);
						await new Promise(r=>setTimeout(r, 250));
					}
					
					
				}
				console.log(`Checked ${player}'s plot [${i}/${amt}], found ${findBlocks.length} shops`)
				await new Promise(r=>setTimeout(r, sender.utils.random(1500, 2500)));
			}
			console.log('Checked all plots');
		}
	}
})()
