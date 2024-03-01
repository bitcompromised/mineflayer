let Commands = {
	Say: (message)=>{
		console.log(message)
	},
	Exit: ()=>{
		this.exit();
	}
};

Event.on("message", (content)=>{
	let command = content[0];
	if ( Object.keys(Commands).includes(command)) {
		return Commands[command]()
	}
})





