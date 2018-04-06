var serialport = require("serialport");
var scanf = require('scanf');
var Serialport = serialport.Serialport;

var espera = function(){
	console.log("wait");
}


var mySerial = new serialport("/dev/ttyUSB1",{
	baudRate: 9600
});



mySerial.on("open", function () {
    console.log('open');

    
    setTimeout(function() {
        mySerial.write("Hello...", function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
        
        setTimeout(function() {
            mySerial.write("\n...from Node.js", function(err, results) {
                console.log('err ' + err);
                console.log('results ' + results);
            });     
        }, 1000);
        
    }, 3000);
    
    var name = scanf('%s');
    mySerial.write(name, function(err, results){});
});



mySerial.on("data", function(dados){
	console.log(dados);
});