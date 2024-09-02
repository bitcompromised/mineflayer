(()=>{
	return	{
		makeBusy: true,
		cmd: "goto",
		//alias: null,
		args: "string",
		usage: "goto < player | x, y, z>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender, args){
			sender.busy = true;
			const defaultMove = new sender.Movements(sender.bot);


			if(args.length === 1 && typeof(args[0]) === 'string'){
				const entity = Object.values(sender.bot.entities).filter(e => e.username === args[0])[0];

				if (!entity) return;
	
				const p = entity.position
	
				sender.bot.pathfinder.setMovements(defaultMove)
				sender.bot.pathfinder.setGoal(new sender.goals.GoalNear(p.x, p.y, p.z, 1))
			} else if ( args.length === 3 && args.filter(n=>Number(n) == n).length === 3){	
				sender.bot.pathfinder.setMovements(defaultMove)
				sender.bot.pathfinder.setGoal(new sender.goals.GoalNear(args[0], args[1], args[2], 1))
			} else {
				console.log(args, args.length);
			}

			sender.busy = false;
		}
	}
})()
