Version 1.0.1:
	+ cfbot
		Randomization base: 2.(random(1,300))



Version 1.1.0 Planned:

  + Database
  + SeenPlayers ( Cache to Database )
  + CheckPlots -> client.database.seenPlayers.forEach->/p h {player} -> isSigns -> Check if shops have space -> Check shop owner balance -> collectSign Shop Data to Database
  + AutoFish
  + Bug Fixes


im considering the version as of 3:45am EST 3/10/2024
as Version 1.0.0

so Version 1.0.0:

+ features
- Modular Command design
- Rejoin after kicked / disconnected
- reloads revious events/modules !?


+ bugs
- Rejoin feature ( recreating the mineflayer bot and reintergrating all events) creates eval error
~ fix = remove eval? require() modules
+ issues
- Rejoin doesnt save the states of things
~ fix = process more data to predict !pending! status and expected result


/Source/Client.mjs
 f cRequire( path)
  - Unresolved error when reconnecting bot automatically. Attempted patch, unknown if fix

[Client] Session has ended with reason: disconnect.quitting
undefined:185
                                                sender.bot.chat("/ah");
                                                           ^
TypeError: sender.bot.chat is not a function
    at Timeout.eval [as _onTimeout] (eval at cRequire 


 c Client( settings, cmds, rejoin)
 c CommandHandler( bot, commandList)
/Utilities/Utilities.mjs
 f parseNBT( itemNBT) -> { name, lore, price }
  - only works with ViaVersion...
 f parseMessage( jsonMsg) -> { tags, sender, text }
  - specific version only works on purple prison?
 f moneyFormat( amt) -> "1k,1m,1b,1t,1q"
 f random( min, max)

/Commands/...
   Advertise
   AhSniper
   ClearAh
   CoinFlip
   CoinFlip2 ? CoinFlipSpoofer
   DropStack <slot>
   Equip <slot>
   ActivateItem
   DeActivateItem
   Find <block|player|entity> <search_text>
   Goto
     ! x,y,z pos doesnt work
   Say
   SearchBlock
     ! change to SearchRegistry < Type: item | block | entity > < name: string > < shortText: bool >
   ShowHand
   ShowInventory
   Help
