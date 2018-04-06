var serialport = require("serialport");
var Serialport = serialport.Serialport;

var espera = function(){
	console.log("wait");
}


var mySerial = new serialport("COM3",{
	baudRate: 9600
});







mySerial.on("data", function(dados){
	console.log(dados);
});