
var serialport = require("serialport");
var Serialport = serialport.Serialport;


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
	baudRate: 9600,
	parser: new serialport.parsers.Readline("\n")
});


function escrever(data, callback) {
	setTimeout(function() {
		mySerial.write(data + "\n");
		mySerial.drain(callback);
	},50);
	
}





mySerial.on("open", function(){
	console.log("porta aberta");
	mySerial.pause();
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
	
    var game = setInterval(function (){
    	console.log(currentCommand);
		if (status == "start-menu"){
				
			// <image destroyAfterShow="true">System.splashPath</image>    
			console.log(splashText);
			console.log('EQ -Start');
			console.log(' + -score');
			console.log(' - -About');	
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
			  
			currentMessage = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'message');
			//currentImagePath=JS.EVAL(require('System.currentPath'+'IMgineAdapter.js').getGameStatus('System.jidServer','System.jidClient','imagePath'));;;
			currentPromptText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'promptText');
			currentMenuText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'menuText');
			currentOpt1 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option1');
			currentOpt2 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option2');
			currentOpt3 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option3');
			currentOpt4 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option4');
			currentOpt5 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option5');
					  
			if (currentMessage != '') console.log(currentMessage);
			/*
			<command condition="'System.currentImagePath'!=''"> 
			  <image >System.currentImagePath</image>  
			</command>
			*/
			
			if (currentPromptText != "") 
				console.log(currentPromptText);
			
			if (currentOpt1 != '') {
				console.log(currentMenuText);   
					
				console.log("1- "+currentOpt1);  
				if (currentOpt2 != '') console.log("2- "+currentOpt2);
				if (currentOpt3 != '') console.log("3- "+currentOpt3);
				if (currentOpt4 != '') console.log("4- "+currentOpt4);
				if (currentOpt5 != '') console.log("5- "+currentOpt5);
			}
			
			currentCommand = "";
			status = "get-input";

		}
		
		if (status == "get-input" && currentCommand != ""){
			

			status = "update";
			
			if (currentOpt1 != "") {
				if (currentCommand == "1") currentCommand = currentOpt1;
				else if (currentCommand == "2") currentCommand = currentOpt2;
				else if (currentCommand == "3") currentCommand = currentOpt3;
				else if (currentCommand == "4") currentCommand = currentOpt4;
				else if (currentCommand == "5") currentCommand = currentOpt5;
				else {        
					console.log("Opção inválida!!");
					currentCommand = ""; 
					status = "getInput";
				}
			}			
		}
		
		if (status == "update" && currentCommand != ""){
			
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
			
			console.log(gameEndMessage);	
			currentCommand = "";			

			if (gameEndMessage != '' && highScoreText != '' && highScorePosition >= 0 && highScorePosition <= rankSize){
				console.log(highScoreText);				
				status = "highscore";
			}
			else {
				console.log('Try again (Y-Yes/N-No):');
				status = "try-again";
			}
		}
			
		if (status == "highscore" && currentCommand != ""){
			
			require('./IMgineAdapter.js').storeHighScore(jidServer, jidClient, currentCommand);
			currentCommand = "";
			console.log('Try again (Y-Yes/N-No):');
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
			
			console.log(require('./IMgineAdapter.js').getHighScores(jidServer));
			console.log('EQ -Start');
			console.log(' + -score');
			console.log(' - -About');	
			currentCommand = "";	
		}
		
		if (status == "start-menu" && currentCommand == "3"){
			
			console.log(aboutText);
			console.log('EQ -Start');
			console.log(' + -score');
			console.log(' - -About');	
			currentCommand = "";	
		}

	}, 500);

	
	mySerial.on("readable", function(){
		var data = mySerial.read().toString();
		if (status == "get-input" ) {
			console.log(input);
			if (data == um) {
				input = input + 1;
				console.log(currentPromptText+input);
			}
			else if (data == dois) {
				input = input + 2;
				console.log(input);
			}
			else if (data == tres) {
				input = input + 3;
				console.log(input);
			}
			else if (data == quatro) {
				input = input + 4;
				console.log(input);
			}
			else if (data == cinco) {
				input = input + 5;
				console.log(input);
			}
			else if (data == seis) {
				input = input + 6;
				console.log(input);
			}
			else if (data == sete) {
				input = input + 7;
				console.log(input);
			}
			else if (data == oito) {
				input = input + 8;
				console.log(input);
			}
			else if (data == nove) {
				input = input + 9;
				console.log(input);
			}
			else if (data == zero) {
				input = input + 0;
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