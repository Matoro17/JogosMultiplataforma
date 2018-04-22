var serialport = require("serialport");
var Serialport = serialport.Serialport;

const Readline = require('parser-readline')



var mySerial = new serialport("COM3",{
	baudRate: 9600
});

const parser = mySerial.pipe(new Readline({ delimiter: '\r\n' }));
parser.on('data', console.log);
/*
mySerial.on("readable", function(){
	console.log(mySerial.read().toString());
});*/