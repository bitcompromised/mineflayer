(()=>{
	return	{
		makeBusy: false,
		cmd: "cfbot",
		alias: ['cf', 'cfsniper'],
		args: null,
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender){
			if(!sender.settings.hasOwnProperty('cfbot')){
				sender.rzx = (r)=>{
					switch(r){
						case 1:
							return .4;
						case 2:
							return .6;
						case 3:
							return sender.utils.random(20,60)/100
						case 4:
							return .8;
					}
				}
				console.log("[CLIENT] Initiating CF Bot System for the first time", sender.bot.username);
				// Initiate CF Bot System
				sender.settings.cf = {
					toggled: false,
					profit: 0,
					startBet: 2000000000,
					bet: 2000000000,
					loseMult: 2, // update mult to 3x?
					streak:{
						win: 0,
						lose: 0
					}
				}
				sender.on("message", async (json, sendr)=>{
					let message = sender.utils.parseMessage(json, sendr);
					
					if(message.text.match(/You.*your bet against.*/)){
						let opponent = message.text.match(/against(.*)for/g)[0];//message.text.substr(25 + /won y/.test(message.text) ? 3 : 4).match(/[a-zA-Z0-9_]+/g)[0];
						if(/$/.test(message.text)){ // cf
							if(/won/.test(message.text)){ // won
								console.log(`[CF ${sender.utils.formatDate(new Date(Date.now()))}] You won ${opponent} ${sender.utils.moneyFormat(sender.settings.cf.bet)}`)
								if( sender.settings.cf.streak.lose >= 4){
									//sender.cmds.logChannels.log(`[CF|QUIT] QUTTING CF SESSION TO PREVENT TRILLIONAIRES FROM BANKRUPTING BOT`);
									sender.cmds.logChannels.log(`[CF|WIN] ${sender.bot.username}->${opponent} $${sender.utils.moneyFormat(sender.settings.cf.bet)} | profit : ${sender.utils.moneyFormat(sender.settings.cf.profit + sender.settings.cf.bet)} | streak W: ${sender.settings.cf.streak.win + 1} L: 0`);
									//bot.exit();
								}
								//sender.cmds.logChannels.log(`[CF|WIN] ${sender.bot.username}->${opponent} $${sender.utils.moneyFormat(sender.settings.cf.bet)} | profit : ${sender.utils.moneyFormat(sender.settings.cf.profit + sender.settings.cf.bet)} | streak W: ${sender.settings.cf.streak.win + 1} L: 0`);
								sender.settings.cf.profit += sender.settings.cf.bet;
								sender.settings.cf.bet = sender.settings.cf.startBet;
								sender.settings.cf.streak.win += 1;
								sender.settings.cf.streak.lose = 0;
							} else { // lost
								console.log(`[CF ${sender.utils.formatDate(new Date(Date.now()))}] You lost ${opponent} ${sender.utils.moneyFormat(sender.settings.cf.bet)} | Streak: ${sender.settings.cf.streak.lose}`)
								if( sender.settings.cf.streak.lose >= 4){
									sender.cmds.logChannels.log(`[CF|LOSE] ${sender.bot.username}->${opponent} -$${sender.utils.moneyFormat(sender.settings.cf.bet)} | profit : -${sender.utils.moneyFormat(sender.settings.cf.profit - sender.settings.cf.bet)} | streak W: 0 L: ${sender.settings.cf.streak.lose + 1}`);
								}
								
								sender.settings.cf.profit -= sender.settings.cf.bet;
								//if(sender.settings.cf.streak.lose >= 5 && sender.settings.cf.bet < 700000000000){
								//	sender.settings.cf.bet = Math.floor(sender.settings.cf.bet* (3 + sender.rzx(sender.utils.random(1,4))));
								//}if(sender.settings.cf.streak.lose >= 0){
								if(sender.settings.cf.bet < 2000000000000)
									sender.settings.cf.bet = Math.floor(sender.settings.cf.bet* 3);
								else
									sender.settings.cf.bet = Math.floor(sender.settings.cf.bet* (2 + sender.utils.random(10,100)/10000+ sender.rzx(sender.utils.random(1,3))));
								//} else {
								//	sender.settings.cf.bet *= 2;
								//}
								sender.settings.cf.streak.win = 0;
								sender.settings.cf.streak.lose += 1;
							}
							console.log(`Profit: $${sender.utils.moneyFormat(sender.settings.cf.profit)}`)
							await new Promise(r=>setTimeout(r, sender.utils.random(5000,35000)));
							sender.bot.chat(`/cf ${sender.settings.cf.bet} ${sender.utils.random(0,100) > 50 ? 'heads' : 'tails'}`);
							console.log(`/cf ${sender.settings.cf.bet} ${sender.utils.random(0,100) > 50 ? 'heads' : 'tails'}`)
							if(sender.settings.cf.streak.lose >= 3){
								sender.bot.chat(`${sender.utils.moneyFormat(sender.settings.cf.bet)} cf up`)
									// Advertise {msg: "1b cf up"}
							}
						} else { // tf
							
						}
					}
					
				})
			}
			if(sender.settings.cf.toggled){
				sender.settings.cf.toggled = false;
				console.log(`[CFBOT] ${sender.settings.cf.toggled}`)
			} else {
				sender.settings.cf.toggled = true;
				console.log(`[CFBOT] ${sender.settings.cf.toggled}`)
				sender.bot.chat(`/cf ${sender.settings.cf.bet} ${sender.utils.random(0,1) ? 'heads' : 'tails'}`)
				// Initiate Process CF: sender.chat()
			}
		}
	}
})()
