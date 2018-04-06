
var serialport = require("serialport");
var Serialport = serialport.Serialport;


var menos =  "menos";
var mais =  "mais";
var EQ =  "EQ";
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
	parser: new serialport.parsers.Readline("\r\n")
});

function escrever(text){
		setTimeout(function() {
        	mySerial.write(text, function(err, results) {
            console.log('err ' + err);
            console.log('results ' + results);
        });
        
    }, 3000);
}




mySerial.on("open", function(){
	console.log("Porta Aberta");

	escrever("porta aberta");

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

	}, 1000);

	
	mySerial.on("data", function(dados){
		
		if (status == "get-input") {
			if (dados == um) {
				input = input + 1;
				console.log(input);
			}
			else if (dados == dois) {
				input = input + 2;
				console.log(input);
			}
			else if (dados == tres) {
				input = input + 3;
				console.log(input);
			}
			else if (dados == quatro) {
				input = input + 4;
				console.log(input);
			}
			else if (dados == cinco) {
				input = input + 5;
				console.log(input);
			}
			else if (dados == seis) {
				input = input + 6;
				console.log(input);
			}
			else if (dados == sete) {
				input = input + 7;
				console.log(input);
			}
			else if (dados == oito) {
				input = input + 8;
				console.log(input);
			}
			else if (dados == nove) {
				input = input + 9;
				console.log(input);
			}
			else if (dados == zero) {
				input = input + 0;
				console.log(input);
			}
			else if (dados == EQ){
				currentCommand = input;
				input = "";
			}

		}
		else{
			console.log(dados);
			if (EQ == dados) {
				currentCommand = "1";
			}
			else if(dados == mais){
				currentCommand = "2";
			}
			else if(dados == menos){
				currentCommand = "3";
			}
			else if(dados == quatro){
				currentCommand = "4";
			}
			else if(dados == cinco){
				currentCommand = "5";
			}

		}
	});

	// TO_DO: ADICIONAR TRATAMENTO KEYPAD !!!
	
});