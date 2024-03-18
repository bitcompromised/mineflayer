(()=>{
	return {
		name: "connect",
		alias: ['join', 'rejoin', 'reconnect'],
		usage: "connect <server>",
		description: "connect to default server or join <server>",
		
		load: false,
		run: (client, args)=>{
			if(!client.connected)
				client.createBot( args.join(' '));
			else
				console.log('???')
		}
	}
})();