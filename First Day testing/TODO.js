import * as pathfind from 'mineflayer-pathfinder';


/*

	This is turning into a pretty big project
	makes sense because this is a pretty expansive API with more than just tangible outcomes
	so hopefully here I can sketch out a plan/outline for how I want this shit to work out
	
	
	
	Classes
		\___ Window Manager
		|___ Item Manager ( to parse item information )
		|___ Client
		|		\___ Simplify some tasks, i.e. (walkTo, lookAt, openChest(racast), say, dig, attack, right click use, etc)
		|		|___ Handle player events (like playerSpotted esque)
		|
		|___ Database Manager ( reuse old one based on JSON storage )
		|		\___ Save data for later use
		
	Utilities (functions)
		\___ String Sanitizer
		|___

	Scripts (code base for scripts using premade-API)
		\___
*/