(()=>{
	return	{
		makeBusy: false,
		cmd: "cfspoof",
		alias: ['cfboost', 'cfs'],
		args: null,
		usage: "say <.*>",
		description: "Outputs the text using the bot.chat method",
		handler: async function(sender){
			if(!sender.settings.hasOwnProperty('cfbotspoofer')){
				sender.rzx = (r)=>{
					switch(r){
						case 1:
							return .25;
						case 2:
							return .3;
						case 3:
							return .5;
						case 4:
							return sender.utils.random(25,50)/100;
					}
				}
				console.log("[CLIENT] Initiating CF SPOOFER Bot System for the first time", sender.bot.username);
				// Initiate CF Bot System
				sender.settings.cfbotspoofer = {
					toggled: false,
					profit: 0,
					startBet: (sender.utils.random(1,5) * (sender.utils.random(0,1) ? 1000000 : 10000000))+(10000000*sender.rzx(sender.utils.random(1,3))),
					bet: (sender.utils.random(1,5) * (sender.utils.random(0,1) ? 1000000 : 10000000))+(10000000*sender.rzx(sender.utils.random(1,3))),
					loseMult: 2,
					streak:{
						win: 0,
						lose: 0
					}
				}
				
				/*
				
				setInterval(()=>{
					sender.settings.cfbotspoofer.toggled && sender.bot.chat('/cf');
				}, 1600);
				
				sender.on('windowOpened', (window)=>{
					
				})
				
				*/
				
				let wonOver9 = false;
				let profitAtWonAt9 = 0;
				let won3tPast = false;
				
				let loses = 0;
				let wins = 0;
				
				let games = [];
				
				sender.on("message", async (json, sendr)=>{
					let message = sender.utils.parseMessage(json, sendr);
					
					if(message.text.match(/You.*your bet against.*/)){
						let opponent = message.text.match(/against(.*)for/g)[0];//message.text.substr(25 + /won y/.test(message.text) ? 3 : 4).match(/[a-zA-Z0-9_]+/g)[0];
						if(/$/.test(message.text)){ // cf
							let mult;
							let extra = false;
							if(/won/.test(message.text)){ // won
								games.push(1);
								wins++;
								//console.log(`[CFS ${sender.utils.formatDate(new Date(Date.now()))}] You won ${opponent} ${sender.utils.moneyFormat(sender.settings.cfbotspoofer.bet)}`)
								if( sender.settings.cfbotspoofer.streak.lose >= 6){
									sender.cmds.log('coinflip', `[CFS] Win ${opponent} ${sender.utils.moneyFormat(sender.settings.cfbotspoofer.bet)} | profit : ${sender.utils.moneyFormat(sender.settings.cfbotspoofer.profit + sender.settings.cfbotspoofer.bet)} `);
								}
								
								if(wonOver9){
									if(won3tPast)
										throw new Error('Won over 9 and won 4t past');
									if( sender.settings.cfbotspoofer.profit - profitAtWonAt9 > 3000000000000)
										throw new Error('won 4t past 9x')
								}
								
								if( sender.settings.cfbotspoofer.streak.lose >= 9){
									if( wonOver9)
										throw new Error('Won over 9 twice ;(');
									wonOver9 = true;
								}
								if( sender.settings.cfbotspoofer.bet >= 1000000000000){
									
								}
								sender.settings.cfbotspoofer.profit += sender.settings.cfbotspoofer.bet;
								sender.settings.cfbotspoofer.bet = (sender.utils.random(2,5) * (sender.utils.random(0,1) ? 100000 : sender.utils.random(0,1) ? 1000000 : 10000000))*(1*sender.rzx(4))//sender.utils.random(10000000,230000000);
								sender.settings.cfbotspoofer.streak.win += 1;
								sender.settings.cfbotspoofer.streak.lose = 0;
							} else { // lost
								games.push(0);
								loses++;
								//console.log(`[CFS ${sender.utils.formatDate(new Date(Date.now()))}] You lost ${opponent} ${sender.utils.moneyFormat(sender.settings.cfbotspoofer.bet)} | Streak: ${sender.settings.cfbotspoofer.streak.lose + 1}`)
								sender.settings.cfbotspoofer.profit -= sender.settings.cfbotspoofer.bet;
								sender.settings.cfbotspoofer.streak.win = 0;
								sender.settings.cfbotspoofer.streak.lose += 1;
								if( sender.settings.cfbotspoofer.streak.lose >= 10 && (Math.floor((wins/(wins+loses))*1000)/10) < 44){// Increase to +2.5t profit?
									sender.settings.cfbotspoofer.bet *= 2.25;
									sender.settings.cfbotspoofer.bet += 2500000000000;
									mult = 2.25;
									extra = 2500000000000;
								} else if (sender.settings.cfbotspoofer.streak.lose == 4){
									let rand = sender.utils.random(1,4) * 100000000 + 100000000*sender.rzx(sender.utils.random(1,4));
									sender.settings.cfbotspoofer.bet *= 2.5;
									sender.settings.cfbotspoofer.bet += rand;
									mult = 2.5;
									extra = rand;
								}else if (sender.settings.cfbotspoofer.streak.lose == 5) {
									let rand = sender.utils.random(1,2) * 1000000000 + 1000000000*sender.rzx(sender.utils.random(1,4));
									sender.settings.cfbotspoofer.bet *= 2.5;
									sender.settings.cfbotspoofer.bet += rand;
									mult = 2.5;
									extra = rand;
								} else if (sender.settings.cfbotspoofer.streak.lose == 6) {
									let rand = sender.utils.random(1,2) * 1000000000 + 1000000000*sender.rzx(sender.utils.random(1,4));
									sender.settings.cfbotspoofer.bet *= 2.25;
									sender.settings.cfbotspoofer.bet += rand;
									mult = 2.25;
									extra = rand;
								} else if( Number(sender.settings.cfbotspoofer.bet) < 2000000000000){
									if( true ){
										mult = sender.utils.random(0, 1) ? sender.utils.random(2,3) : 2 + sender.rzx(sender.utils.random(1,3))
										sender.settings.cfbotspoofer.bet = sender.settings.cfbotspoofer.bet* (mult);
									}else {
										//  This is Normal Mult IF()
										// Do last 50 game logic on if should increase heavy
									}
								} else {
									mult = 2.25;
									sender.settings.cfbotspoofer.bet = sender.settings.cfbotspoofer.bet* (2.25);
								}
							}
							console.log(`Profit: $${sender.utils.moneyFormat(sender.settings.cfbotspoofer.profit)} | game: ${wins+loses} | odds %${(Math.floor((wins/(wins+loses))*1000)/10)} ${games.length >= 50 ? `last 50 games %${(Math.floor((games.slice(games.length-50).filter(v=>v).length/(50))*1000)/10)}` : ''}${games.length >= 100 ? ` last 100 games %${(Math.floor((games.slice(games.length-100).filter(v=>v).length/(100))*1000)/10)}` : ''} | last bet ${/won/.test(message.text) ? 'won' : 'lost'} ${opponent} ${sender.utils.moneyFormat((sender.settings.cfbotspoofer.bet - (extra ?? 0))/mult)}`)
							//await new Promise(r=>setTimeout(r, sender.utils.random(45000,600000)));
							await new Promise(r=>setTimeout(r, sender.utils.random(4000,45000)));
							let side = sender.utils.random(0, 100);
							sender.bot.chat(`/cf ${Math.ceil(sender.settings.cfbotspoofer.bet)} ${side > 50 ? 'heads' : 'tails'}`)
							console.log(`/cf ${sender.settings.cfbotspoofer.bet} ${side > 50 ? 'heads' : 'tails'} - ${side} (${mult? mult : 'won game'}x${extra? ` + $${sender.utils.moneyFormat(extra)}` : ''})`)
						} else { // tf
							
						}
					}
					
				})
			}
			if(sender.settings.cfbotspoofer.toggled){
				sender.settings.cfbotspoofer.toggled = false;
				console.log(`[CFSBOT] ${sender.settings.cfbotspoofer.toggled}`)
			} else {
				sender.settings.cfbotspoofer.toggled = true;
				console.log(`[CFSBOT] ${sender.settings.cfbotspoofer.toggled}`)
				console.log(`/cf ${sender.utils.moneyFormat(sender.settings.cfbotspoofer.bet)} ${sender.utils.random(0,100) > 50 ? 'heads' : 'tails'}`)
				sender.bot.chat(`/cf ${sender.settings.cfbotspoofer.bet} ${sender.utils.random(0,1) ? 'heads' : 'tails'}`)
				// Initiate Process CF: sender.chat()
			}
		}
	}
})()
