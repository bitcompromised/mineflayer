import mineflayer from 'mineflayer';

const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: 'KendallLover123', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft' // for offline mode servers, you can set this to 'offline'
})

function MessageHandler(jsonMsg, position, sender, verified){
	console.log(jsonMsg);
}

bot.on('message', (jsonMsg, position, sender, verified) => MessageHandler)

bot.on('kicked', (reason, loggedIn) => {
	console.log(`Bot kicked for ${reason}\nLogged in: ${loggedIn}`)
})
bot.on('end', (reason) => {
	console.log(`Session has ended with reason: ${reason}`);
})
bot.on('error', console.log)
bot.once('spawn', ()=>{
	console.log(`Logged in as ${bot.username}`);
	console.log(
		Object.values(bot.entities).filter(e => e.type === "player").map(u => ({username: u.username, distance: u.position.distanceTo(bot.entity.position)})))
})