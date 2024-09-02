
import mineflayer from 'mineflayer';
import readline from 'readline';
import fs from 'fs';
import * as pathfind from 'mineflayer-pathfinder';



const bot = mineflayer.createBot({
  host: 'purpleprison.net',//'purpleprison.net', // minecraft server ip
  username: "KendallLover", // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'microsoft', // for offline mode servers, you can set this to 'offline'
  viewDistance: "tiny",
});

bot.loadPlugin(pathfind.pathfinder)