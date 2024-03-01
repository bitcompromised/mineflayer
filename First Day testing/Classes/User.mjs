export default class User {
	#bot;
	
	get nearbyUsers(){
		return Object.values(bot.entities).filter(e => e.type === "player").map(u => u.username);
	}
	get nearbyUserEntities(){
		return Object.values(bot.entities);
	}
	
	constructor( bot){
		this.#bot = bot;
	}
}