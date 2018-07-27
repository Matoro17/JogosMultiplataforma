
exports.setGameConfig = function(gameConfig){
	gameConfig.splashText = "Welcome to GuessMyNumberBot!!\n\nPlease select an option:";
	gameConfig.aboutText = "This demo game was developed by prof. D.Sc. Victor Sarinho at UEFS - Brazil. Enjoy it."
};
		
exports.startGameStatus = function(jidServer, jidClient, gameStatus){
	gameStatus.minNumber = 1;
	gameStatus.maxNumber = 1000;
	gameStatus.currentNumber = Math.floor(Math.random() * (gameStatus.maxNumber - gameStatus.minNumber +1)) + gameStatus.minNumber;

	gameStatus.message = "";
	gameStatus.imagePath = "";
	gameStatus.promptText = "Give me a number between "+gameStatus.minNumber+" and "+gameStatus.maxNumber+":";
	gameStatus.menuText = "";
	gameStatus.option1 = "";
	gameStatus.option2 = "";
	gameStatus.option3 = "";
	gameStatus.option4 = ""; 
	gameStatus.option5 = "";
	gameStatus.score = 1; 
	gameStatus.endMessage =  "";
	gameStatus.highScoreText = "Give a name to be included in highscore list:";
}
	
exports.updateGameStatus = function(jidServer, jidClient, gameStatus, command){
	try {
		var suggestedNumber = parseInt(command);
				
		if (suggestedNumber == gameStatus.currentNumber){
			gameStatus.endMessage = "Congratulations!! You discovered my secret number in "+gameStatus.score+" attempts!";			
		}
		else {
			if (suggestedNumber > gameStatus.currentNumber && suggestedNumber < gameStatus.maxNumber)
				gameStatus.maxNumber = suggestedNumber;
			
			if (suggestedNumber < gameStatus.currentNumber && suggestedNumber > gameStatus.minNumber)
				gameStatus.minNumber = suggestedNumber;
				
			gameStatus.score++;
			
			gameStatus.promptText = gameStatus.score+"? attempt! Give me a number between "+gameStatus.minNumber+" and "+gameStatus.maxNumber+":";
			
			console.log("suggestedNumber:"+suggestedNumber+", currentNumber:"+gameStatus.currentNumber+", maxNumber:"+gameStatus.maxNumber+", minNumber:"+gameStatus.minNumber);
		}
	}
	catch (err){
		console.log(err.message);
	}
}

