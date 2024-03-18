(()=>{
	return {
		name: "clear",
		alias: ['cls','clearconsole'],
		usage: "clear <null>",
		description: "Clears the console",
		
		load: false,
		run: (client, args)=>{
			console.clear()
		}
	}
})();