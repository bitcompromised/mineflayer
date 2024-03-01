export default class MessageHandler{
	Sanatize(Content){
		if( !msg) return "";
		let t = "";
		for( let i = 0; i < msg.length; i++){
			if( msg[i] == "§" ){
				i++
			} else {
				t += msg[i]
			}
		}
		return t;
	}
	
	
}