(()=>{
	return {
		name: "advertise",
		alias: ['advert'],
		usage: "advertise <null | bool>",
		description: "Run the test command function",
		
		load: async ( client)=>{
			global.advertising = false;
			while( true){
				if(global.advertising)
					client.bot.chat('/test')
				await new Promise(r=> setTimeout(r, client.utils.random(61000, 450000)));
			}
		},
		run: async ( c, args)=>{
			if( typeof args[0] === 'boolean' || typeof args[0] === 'number' ){
				global.advertising = args[0]
			} else {
				global.advertising = !global.advertising
			}
			console.log(`[Advertising] ${global.advertising}`)
		}
	}
})();