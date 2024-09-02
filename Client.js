import Client from './Source/Client.mjs'

import * as WebhookNode from 'discord-webhook-node';

import process from 'node:process';

let client = new Client({
	host: 'purpleprison.net',
	username: process.argv.splice(2)[0],
	auth: 'microsoft'
}, ['Say', 'Goto', 'CoinFlip', 'CfSpoof', 'Advertise', 'ShowInventory', 'Equip', 'DropStack', 'ShowHand', 'ActivateItem', 'DeActivateItem', 'Help',
'AhSniper','ClearAh',

'User', 'Seen', 'CheckPlots', 'WatchChat', 'AdSnipe',
'GappleBot', 'Crash',

'SearchBlock', 'Find'], 1)
await client.login();


// log 
let lf = new WebhookNode.Webhook("https://discord.com/api/webhooks/1215804774193299506/eI9WS8Ob6YsleSm8OfHwSAb0EN_HXn_zJDM9aNuXDxD5jKfWd3p2UOs6jLSefYQwHHCg");
client.cmds.setLogFunction("log", (msg)=>{
	lf.send(""+msg)
});

// error
let ef = new WebhookNode.Webhook("https://discord.com/api/webhooks/1216245310091689984/1gyfdG-Pw0q88JujmkKdxHuZukifiwedPdn8y7rkNym2sRUKeB6oLQqQRK7wUruXV4Kd");
client.cmds.setLogFunction("error", (msg)=>{
	ef.send(""+msg)
})

// ahFunction
let ah = new WebhookNode.Webhook("https://discord.com/api/webhooks/1215809173523140668/Ta6FSEx_mTlxCerKBrXgc277Yoox0365Q-rllinDBUXfKVsvEoBnmp-VBeQNfB605kZX");
client.cmds.setLogFunction("ah", (msg)=>{
	ah.send(""+msg)
})

// messageFunction
let mf = new WebhookNode.Webhook("https://discord.com/api/webhooks/1215928921691000905/wqLVjpGUMl_3c0bqoPLRsozI6I1qg-SoklkcqKOcZz6qU-VSg-jSIpcpo1qcd9vBDCuV");
client.cmds.setLogFunction("message", (msg)=>{
	mf.send(""+msg)
})

// plot Shop
let ps = new WebhookNode.Webhook("https://discord.com/api/webhooks/1216502329688461393/1_VK3aufmA3UCMT-3Cppx0W1AKjBuot3bQcD94YoYkt9b6rjf9SPJRh_a2NU00kM_i11");
client.ps = (msg)=>{
	ps.send(""+msg)
}
