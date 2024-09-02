(()=>{
	return	{
		makeBusy: false,
		cmd: "gapbot",
		alias: ['makegaps', 'gaps'],
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			
			let chests = {
				gapple: [],
				apple: [],
				gold: []
			}
			
			function getChests(searchDistance = 40){
				
				// let chest.id = 177
				// let oak_wall_sign.id = 199
				
			}
			
			sender.bot.on('windowOpen', (window)=>{
					//Shops
						//Item Shop
							//Farming
								// Buy Apples Here
			})
			
			function permGapMode(){
				
				console.log(`[Perm Gap Mode Loop]`)
				// Inventory Check
				let items = sender.bot.inventory.slots.filter(s=>s);
				items.filter(item=>item.name !== 'gold_block' || item.name !== 'enchanted_golden_apple' || item.name !== 'apple')//.forEach(i=>console.log(i))
				
				
				// if Trash -> Deposite
				// if Gaps -> Deposite
				// if !Gaps && Gold ( > crafting amt ) + Apples + (1 open space)
					// Craft
				// Deposite
			}
			
			
			console.log(`\nENTERING PERMENANT GAPPLE-BOT MODE UNTIL EXIT`);
			let bounds = {
				min: {
					x: 3879,
					y: 3,
					z: 1233
				},
				max: {
					x: 3899,
					y: 28,
					z: 1253
				}
			}
			// bounds: [3879, 28, 1233] x [3899, 3, 1253]
			let cpos = sender.bot.entity.position;
			if(
				cpos.x >= bounds.min.x && cpos.x <= bounds.max.x
					&&
				cpos.y >= bounds.min.y && cpos.y <= bounds.max.y
					&&
				cpos.z >= bounds.min.z && cpos.z <= bounds.max.z
			){ // Bot is in Plot Section
				console.log('Bot is in position...');
				permGapMode();
			} else { // Bot needs to Travel
				sender.bot.chat(`/p h nomoredabs 3`)
				sender.bot.setControlState("forward", true);
				setTimeout(() => {
					sender.bot.setControlState("forward", false);
					const defaultMove = new sender.Movements(sender.bot);
					sender.bot.pathfinder.setMovements(defaultMove);
					sender.bot.pathfinder.setGoal(new sender.goals.GoalNear(3888, 15, 1242, 1));
					console.log('ready?');
				}, 7000)
				sender.bot.pathfinder.setMovements(defaultMove);
				sender.bot.pathfinder.setGoal(new sender.goals.GoalNear(3888, 5, 1242, 1));
				permGapMode();
			}
		}
	}
})()
