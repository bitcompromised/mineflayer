import mineflayer from 'mineflayer';
function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: 'bigtoker443', // bigtoker443, KotaTheDopeFiend
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
  // port: 25565,              // set if you need a port that isn't 25565
  // version: false,           // specify (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})



bot.on("forcedMove", ()=>{
	console.log("Bot forced to move to", bot.entity.position)
})
bot.once('spawn', ()=>{
	console.clear();
	console.log(`Logged in as ${bot.username}`);
	if(Math.floor(bot.entity.position.x) === -17 && Math.floor(bot.entity.position.y) == 53){
		bot.setControlState("forward", true);
		setTimeout(()=>{
			bot.setControlState("forward", false);
		}, 3200)
	}
	bot.chat("[i]");
	setInterval(()=>{
		bot.chat("[i]");
	}, random(60000, 78000));
})


// Log errors and kick reasons:
bot.on('kicked', (reason, loggedIn) => {
	console.log(`Bot kicked for ${reason}\nLogged in: ${loggedIn}`)
})
bot.on('end', (reason) => {
	console.log(`Session has ended with reason: ${reason}`)
})
bot.on('error', console.log)