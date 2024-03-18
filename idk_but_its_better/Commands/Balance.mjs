(()=>{
	return {
		name: "balance",
		alias: ['bal', 'money'],
		usage: "balance <null>",
		description: "display current use balance",
		
		load: false,
		run: async (client, args)=>{
			if(!client.connected)
				return console.log('[CLIENT]'.gray, 'not connected to server'.red.dim)
			client.bot.chat( '/balance');
			let bal = Number((await client.bot.awaitMessage(/Balance:/)).match(/\d+,\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+,\d+|\d+,\d+,\d+,\d+|\d+,\d+,\d+|\d+,\d+|\d+/g)[0].replaceAll(',',''));
			console.log('Balance:', bal);
			return bal;
		}
	}
})();