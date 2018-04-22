
var serialport = require("serialport");
var Serialport = serialport.Serialport;
var Readline = require('parser-readline');

var menos =  "menos";
var mais =  "mais";
var EQ =  "EQ_";
var mais100 =  "mais100";
var mais200 =  "mais200";

var zero	 =  "zero";
var um		 =  "um";
var dois	 =  "dois";
var tres	 =  "tres";
var quatro	 =  "quatro";
var cinco	 =  "cinco";
var seis	=  "seis";
var sete 	 =  "sete";
var oito 	 =  "oito";
var nove	 =  "nove";

var mySerial = new serialport("COM3",{
	baudRate: 9600
});
const parser = mySerial.pipe(new Readline({ delimiter: '\r\n' }));


function escrever(data, callback) {
	setTimeout(function() {
		mySerial.write(data + "\n");
		mySerial.drain(callback);
	},50);
	
}





mySerial.on("open", function(){
	console.log("porta aberta");
	var jidServer = 'local';
	var jidClient = 'myself';
  
	var rankSize = 5;
	require('./IMgineAdapter.js').setGameConfig('./GuessMyNumber.js','asc', rankSize);
	var splashText = require('./IMgineAdapter.js').getGameConfig('splashText');
	//var splashPath = require('./IMgineAdapter.js').getGameConfig('splashPath');
	var aboutText = require('./IMgineAdapter.js').getGameConfig('aboutText');   
	//var aboutPath = require('./IMgineAdapter.js').getGameConfig('aboutPath');       
				
    var status = "start-menu";
    var currentCommand = "";
    var gameEndMessage = "";
	var score = "";
	var highScorePosition = "";
	var highScoreText = "";
	var tryAgain = "";

	var inputenter = 0;
	var input = "";
	
	var output ="";
	var arduinomenu = '\nEQ -Start\n'+' + -score\n'+' - -About\n';

    var game = setInterval(function (){
		console.log(output);
		escrever(output);
		if (status == "start-menu"){
				
			// <image destroyAfterShow="true">System.splashPath</image>  
			output = splashText + arduinomenu;
			
			//currentCommand = "";			
		}
		
		if (status == "start-menu" && currentCommand == "1"){
			
			require('./IMgineAdapter.js').startGameStatus(jidServer, jidClient);
			status = "render";
			
			gameEndMessage = "";	
			score = "";
			highScorePosition = "";
			highScoreText = "";
		}
		
		if (status == "render" && gameEndMessage == ""){		
			console.log(status);
			currentMessage = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'message');
			//currentImagePath=JS.EVAL(require('System.currentPath'+'IMgineAdapter.js').getGameStatus('System.jidServer','System.jidClient','imagePath'));;;
			currentPromptText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'promptText');
			currentMenuText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'menuText');
			currentOpt1 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option1');
			currentOpt2 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option2');
			currentOpt3 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option3');
			currentOpt4 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option4');
			currentOpt5 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option5');
					  
			if (currentMessage != '') output = (currentMessage);
			/*
			<command condition="'System.currentImagePath'!=''"> 
			  <image >System.currentImagePath</image>  
			</command>
			*/
			
			if (currentPromptText != "") 
				output = (currentPromptText) + "\n" + input;
			
			if (currentOpt1 != '') {
				output += (currentMenuText) + "\n";   
					
				output += ("1- "+currentOpt1) + "\n";  
				if (currentOpt2 != '') output += ("2- "+currentOpt2) + "\n";
				if (currentOpt3 != '') output += ("3- "+currentOpt3)+ "\n";
				if (currentOpt4 != '') output += ("4- "+currentOpt4) + "\n";
				if (currentOpt5 != '') output += ("5- "+currentOpt5) + "\n";
			}
			
			currentCommand = "";
			status = "get-input";

		}
		
		if (status == "get-input" && currentCommand != ""){
			console.log(status);

			status = "update";
			
			if (currentOpt1 != "") {
				if (currentCommand == "1") currentCommand = currentOpt1;
				else if (currentCommand == "2") currentCommand = currentOpt2;
				else if (currentCommand == "3") currentCommand = currentOpt3;
				else if (currentCommand == "4") currentCommand = currentOpt4;
				else if (currentCommand == "5") currentCommand = currentOpt5;
				else {        
					output = ("Opção inválida!!");
					currentCommand = ""; 
					status = "getInput";
				}
			}			
		}
		
		if (status == "update" && currentCommand != ""){
			console.log(status);
			require('./IMgineAdapter.js').updateGameStatus(jidServer, jidClient, currentCommand);
					  
			gameEndMessage = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'endMessage');
			score = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'score');
			highScorePosition = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'highScorePosition');
			highScoreText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'highScoreText');
			
			if (gameEndMessage != "") 				
				status = "game-end";
			else 
				status = "render";					
		}
		
		if (status == "game-end"){
			console.log(status);
			output = (gameEndMessage) + "\n";	
			currentCommand = "";			

			if (gameEndMessage != '' && highScoreText != '' && highScorePosition >= 0 && highScorePosition <= rankSize){
				output += (highScoreText) + "\n";				
				status = "highscore";
			}
			else {
				output += ('Try again (Y-Yes/N-No):') + "\n";
				status = "try-again";
			}
		}
			
		if (status == "highscore" && currentCommand != ""){
			
			require('./IMgineAdapter.js').storeHighScore(jidServer, jidClient, currentCommand);
			currentCommand = "";
			output += ('Try again (Y-Yes/N-No):') + "\n";
			status = "try-again";
		}
		
		if (status == "try-again" && currentCommand != ""){
			
			gameEndMessage = "";
			currentCommand = "";
			
			if (gameEndMessage != "" && (currentCommand == "Y" || currentCommand == "y")){				
				require('./IMgineAdapter.js').startGameStatus(jidServer, jidClient);
				status = "render";
			}
			else {
				status = "start-menu";
			}
		}
		
		if (status == "start-menu" && currentCommand == "2"){
			
			output = (require('./IMgineAdapter.js').getHighScores(jidServer)) + "\n";
			output += arduinomenu;	
			currentCommand = "";	
		}
		
		if (status == "start-menu" && currentCommand == "3"){
			
			output += (aboutText) + arduinomenu;	
			currentCommand = "";	
		}

	}, 500);

	
	parser.on("readable", function(){
		var data = parser.read().toString();
		if (status == "get-input" ) {
			
			if (data == um) {
				input = input + 1;
				output += "\n"+input;
			}
			else if (data == dois) {
				input = input + 2;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == tres) {
				input = input + 3;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == quatro) {
				input = input + 4;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == cinco) {
				input = input + 5;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == seis) {
				input = input + 6;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == sete) {
				input = input + 7;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == oito) {
				input = input + 8;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == nove) {
				input = input + 9;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == zero) {
				input = input + 0;
				output += "\n"+input;
				console.log(input);
			}
			else if (data == EQ){
				currentCommand = input;
				input = "";
			}

		}
		else{
			console.log(data);
			if (EQ == data) {
				currentCommand = "1";
			}
			else if(data == mais){
				currentCommand = "2";
			}
			else if(data == menos){
				currentCommand = "3";
			}
			else if(data == quatro){
				currentCommand = "4";
			}
			else if(data == cinco){
				currentCommand = "5";
			}

		}
	});

	// TO_DO: ADICIONAR TRATAMENTO KEYPAD !!!
	
});