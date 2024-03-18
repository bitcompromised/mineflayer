(()=>{
	return {
		name: "test",
		alias: [],
		usage: "test <null>",
		description: "Run the test command function",
		
		load: false,
		run: (client, args)=>{
			console.log('Test ran sucessfully', args);
		}
	}
})();