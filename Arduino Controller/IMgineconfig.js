
var scanf = require('scanf');

while (true){
	var jidServer = 'local';
	var jidClient = 'myself';
	
	var rankSize = 5;
	require('./IMgineAdapter.js').setGameConfig('./GuessMyNumber.js','asc', rankSize);
	splashText = require('./IMgineAdapter.js').getGameConfig('splashText');
	//splashPath = require('./IMgineAdapter.js').getGameConfig('splashPath');
	aboutText = require('./IMgineAdapter.js').getGameConfig('aboutText');   
	//aboutPath = require('./IMgineAdapter.js').getGameConfig('aboutPath');				
	
	// <image destroyAfterShow="true">System.splashPath</image>    
	console.log(splashText);
	
	console.log('S- Start');
	console.log('H- Highscore');
	console.log('A- About');
	
	var menuOption = scanf('%s');	
	
	switch (menuOption.trim()) {
		case 's':
		case 'S':
		case 'start':
			gameEndMessage = '';
			require('./IMgineAdapter.js').startGameStatus(jidServer, jidClient);
				
			while (gameEndMessage == '' ){
				currentMessage = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'message');
				//currentImagePath=JS.EVAL(require('System.currentPath'+'IMgineAdapter.js').getGameStatus('System.jidServer','System.jidClient','imagePath'));;;
				currentPromptText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'promptText');
				currentMenuText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'menuText');
				currentOpt1 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option1');
				currentOpt2 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option2');
				currentOpt3 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option3');
				currentOpt4 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option4');
				currentOpt5 = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'option5');
									
				if (currentMessage !='' ) console.log(currentMessage);
				/*
				<command condition="'System.currentImagePath'!=''"> 
					<image >System.currentImagePath</image>  
				</command>
				*/
				
				var currentCommand = '';
				
				if (currentPromptText !='' ) {
					console.log(currentPromptText);
					currentCommand = scanf('%s');					
				}				
				
				if (currentOpt1 != '') {
					currentCommand = '';
					while (currentCommand == '') {
						console.log(currentMenuText);   
						
						console.log("1- "+currentOpt1);  
						if (currentOpt2 != '') console.log("2- "+currentOpt2);
						if (currentOpt3 != '') console.log("3- "+currentOpt3);
						if (currentOpt4 != '') console.log("4- "+currentOpt4);
						if (currentOpt5 != '') console.log("5- "+currentOpt5);
												
						currentCommand = scanf('%s');
					
						if (currentCommand == '1') currentCommand = option1;
						else if (currentCommand == '2') currentCommand = option2;
						else if (currentCommand == '3') currentCommand = option3;
						else if (currentCommand == '4') currentCommand = option4;
						else if (currentCommand == '5') currentCommand = option5;
						else {							
							currentCommand = '';							
							console.log("Opção inválida!!");
						}
					}
				}	
				
				require('./IMgineAdapter.js').updateGameStatus(jidServer, jidClient, currentCommand);
									
				gameEndMessage = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'endMessage');
				score = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'score');
				highScorePosition = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'highScorePosition');
				highScoreText = require('./IMgineAdapter.js').getGameStatus(jidServer, jidClient, 'highScoreText');
								
				if (gameEndMessage != '') console.log(gameEndMessage);

				if (gameEndMessage != '' && highScoreText != '' && highScorePosition >= 0 && highScorePosition <= rankSize){
					console.log(highScoreText);
					require('./IMgineAdapter.js').storeHighScore(jidServer, jidClient, scanf('%s'));					
				}
				
				var tryAgain = '';
				if (gameEndMessage != '') {
					console.log('Try again (Y-Yes/N-No):');
					tryAgain = scanf('%s');
				}

				if (gameEndMessage != '' && (tryAgain == 'Y' || tryAgain == 'y')){
					gameEndMessage='';
					tryAgain='';
					require('./IMgineAdapter.js').startGameStatus(jidServer, jidClient);
				}
			}
			break;
		  
		case 'h':
		case 'H':
		case 'highscore':		  
			console.log(require('./IMgineAdapter.js').getHighScores(jidServer)); 
			break;
		 
		case 'a':
		case 'A':
		case 'about':
			console.log(aboutText);
			break;
		  
		default:
			console.log('Invalid command!!');
			break;
	}
	            
}