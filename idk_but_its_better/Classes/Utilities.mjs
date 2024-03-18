const random = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
}
const formatDate = (date) => {
	let day = date.getDate().toString().padStart(2, '0');
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let year = date.getFullYear().toString().slice(-2);
	let hours = date.getHours().toString().padStart(2, '0');
	let minutes = date.getMinutes().toString().padStart(2, '0');
	let seconds = date.getSeconds().toString().padStart(2, '0');
	let milliseconds = date.getMilliseconds().toString().padStart(3, '0');
	
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}
export { 
	random,
	formatDate,
}