(() => {
	return {
		makeBusy: false,
		cmd: "ahsniper",
		alias: ['ahs', 'ahsnipe'],
		usage: "ahsniper",
		description: "Toggles using the /AH Sniper",
		handler: async function(sender, args) {
			if (sender.busy && sender.settings.hasOwnProperty('ahsniper') && !sender.settings.ahsniper)
				return;

			if (!sender.settings.hasOwnProperty('ahsniper')) {
				console.log("Setting up AHSniper");
				sender.on("windowOpen", async (window) => {
					
					globalThis.curWindow = window;
					//console.log(window.title.value)
					let title = sender.utils.sanitizeText(window.title.value);

					let id = window.id;
					let inventoryStart = window.inventoryStart;
					let inventoryEnd = window.inventoryEnd;
					let hotbarStart = window.hotbartStart;
					let craftingResultSlot = window.craftingResultSlot;
					let selectedItem = window.selectedItem;

					let slots = window.slots



					if (/Auction House/.test(title)) {
						if (sender.settings.ahclear)
							return await window.withdraw( slots[46].type, slots[46].metadata ?? null, slots[46].count, slots[46].nbt ?? null);
						// Iterate over items
						for (let i = 0; i < 35; i++) {
							let item = slots[i];
							let item_count = item.count;
							let item_type = item.name;
							let item_info = sender.utils.parseNBT(item.nbt);

							if (!item_info.lore || !item_info.name || !item_info.price)
								continue;

							let item_price = item_info.price;
							
							if(item_type === 'chest')
								continue;

							switch (item_type) {
								case "diamond_axe":
									if (item.enchants.length <= 3 && item.enchants.filter(e => e.name === "sharpness").length !== 0 && item.enchants.filter(e => e.name === "sharpness")[0].lvl === 100 && item.enchants.filter(e => e.name === "mending").length === 0) {
										// Real Axe
										if (!item.enchants.filter(e => e.name === "vanishing_curse")[0]) { // if (!Cov_Axe)
											// Omega Axe
											if (item_price <= 500000000000) {
												sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
												console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
												return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											}
										} else {
											// Cov Axe
											if (item_price <= 350000000000) {
												//hook.send(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
												sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
												console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
												return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
												break;
											}
										}
									}
									break;
								case "stick":
									if (item_info.name === "OMEGA AXE PIECE") {
										if ((item_price / item_count) <= 100000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											
										}
									} else if (item_info.name === "GOD BOOTS PIECE" || item_info.name === "GOD LEGGINGS PIECE" || item_info.name === "GOD CHESTPLACE PIECE" || item_info.name === "GOD HELMET PIECE" || item_info.name === "GOD BOW PIECE") {
										if ((item_price / item_count) <= 1500000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === "KNOCKBACK STICK") {
										if ((item_price / item_count) <= 9000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "redstone_torch":
									if (item_info.name === 'SUPPLYDROP FLARE') {
										if ((item_price / item_count) < 30000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "firework_star":
									if (item_info.name === 'MineNUKE') {
										if ((item_price / item_count) <= 6000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "tripwire_hook":
									if (item_info.name === 'RANKUP CRATE KEY') {
										if ((item_price / item_count) < 1000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === 'VOTE CRATE KEY') {
										if ((item_price / item_count) < 5000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === 'PURPLE CRATE KEY') {
										if ((item_price / item_count) < 20000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === 'GOD CRATE KEY') {
										if ((item_price / item_count) < 40000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "ender_chest":
									if (item_info.name === '*** RESET CRATE ***') {
										if ((item_price / item_count) < 3900000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === 'TOKEN POUCH') {
										if ((item_price / item_count) < 700000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "name_tag":
									if (item_info.name === '+1 EXTRA PLOT') {
										if ((item_price / item_count) < 35000000000) {
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (item_info.name === 'BLAST ENCHANT CREDIT') {
										if ((item_price / item_count) < 225000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (/EFFECT/.test(item_info.name) || /TAG/.test(item_info.name) || /SOUND/.test(item_info.name)) {
										if ((item_price / item_count) <= 1000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									} else if (/VOUCHER/.test(item_info.name)) {
										if ((item_price / item_count) <= 20000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "paper":
									if (item_info.name === 'ScratchCard') {
										if ((item_price / item_count) < 50000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "ghast_tear":
									if (item_info.name === 'PvP-Mine Activator') {
										if ((item_price / item_count) < 1500000000000) {
											sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
											return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
											break;
										}
									}
									break;
								case "diamond_helmet":
									if (item.enchants.filter(e => e.name === "unbreaking").length !== 0 && item.enchants.filter(e => e.name === "unbreaking")[0].lvl >= 90 && item_price <= 6000000000){
										sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
										break;
									}
									break;
								case "diamond_chestplate":
									if (item.enchants.filter(e => e.name === "unbreaking").length !== 0 && item.enchants.filter(e => e.name === "unbreaking")[0].lvl >= 90 && item_price <= 3500000000){
										sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
										break;
									}
									break;
								case "diamond_leggings":
									if (item.enchants.filter(e => e.name === "unbreaking").length !== 0 && item.enchants.filter(e => e.name === "unbreaking")[0].lvl >= 90 && item_price <= 2000000000){
										sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
										break;
									}
									break;
								case "diamond_boots":
									if (item.enchants.filter(e => e.name === "unbreaking").length !== 0 && item.enchants.filter(e => e.name === "unbreaking")[0].lvl >= 90 && item_price <= 2000000000){
										sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
										break;
									}
									break;
								case "enchanted_golden_apple":
									if (item_price/item_count <= 15000000){
										sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
										return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
										break;
									}
									break;
								case "diamond_sword":
									if(
										item.enchants.length === 1 &&
										item.enchants.filter( e => e.name === 'sharpness') .length === 1
									){
										switch(item.enchants.filter( e => e.name === 'sharpness')[0].lvl) {
											case 90: // pgod
												if(item_price <= 9000000000){
													sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
													break;
												}
												break;
											case 80: // tnt
												break;
										}
									}
									break;
								case "bow":
									if(
										item.enchants.length === 5 &&
										item.enchants.filter( e => e.name === 'infinity' || e.name === 'unbreaking' || e.name === 'power' || e.name === 'punch' || e.name === 'flame') .length === 5
									){
										switch(item.enchants.filter( e => e.name === 'punch')[0].lvl) {
											case 2:
												if(item_price <= 5000000000){
													sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
													break;
												}
												break;
											case 3:
												if(item_price <= 173000000000){
													sender.cmds.log('ah', `[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													console.log(`[AH BOT ${sender.utils.formatDate(new Date(Date.now()))}] Buying ${item_count}x${item_type}[${item_info.name}] for ${sender.utils.moneyFormat(Number(item_price) / item_count)}/e seller: ${item_info.lore.filter(l=>l.match(/Seller/))[0].substr(12)}`);
													return await window.withdraw( item.type, item.metadata ?? null, item.count, item.nbt ?? null);
													break;
												}
												break;
										}
									}
									break;
							}
						}
					} else if (/Buy Item/.test(title)){
						await new Promise(r => setTimeout(r, sender.utils.random(300, 1500)));
						return await window.withdraw( slots[3].type, slots[3].metadata ?? null, slots[3].count, slots[3].nbt ?? null);
					} else if (/Bought Items/.test(title)) {
						console.log('Boughtitems');
						if(!slots[0])
							return sender.settings.ahclear = false;
						else {
							let item_info = sender.utils.parseNBT(slots[0].nbt);
							console.log(`[AHCLEAR ${sender.utils.formatDate(new Date(Date.now()))}] Collecting [${slots[0].count}x${slots[0].name}]${item_info.name}`)
							await new Promise(r => setTimeout(r, sender.utils.random(1385, 2425)));
							return slots[0] && await window.withdraw( slots[0].type, slots[0].metadata ?? null, slots[0].count, slots[0].nbt ?? null);
						}
						/*
							while(slots[0]){
								let item_info = sender.utils.parseNBT(slots[0].nbt);
								console.log(`[AHCLEAR] Collecting ${item_info.name}[${slots[0].name}] from ah`)
								await window.withdraw( slots[0].type, slots[0].metadata ?? null, slots[0].count, slots[0].nbt ?? null);
								await new Promise(r => setTimeout(r, sender.utils.random(2385, 4425)));
							}
							sender.settings.ahclear = false;
						*/
						
						window.close();
						if(sender.settings.ahclear || sender.settings.ahsniper){
							await new Promise(r => setTimeout(r, sender.utils.random(1385, 2425)));
							sender.bot.chat(`/ah`)
						}
					}
				})

				sender.bot.chat("/ah");
				setInterval(() => {
					if (sender.settings.ahsniper ){//!sender.settings.ahclear) {	
						sender.bot.chat("/ah");
					}
				}, 2500)
			}

			sender.settings.ahsniper = !sender.settings.ahsniper;
			console.log(`[AHSNIPER] ${sender.settings.ahsniper}`)
			sender.busy = sender.settings.ahsniper;
		}
	}
})()
