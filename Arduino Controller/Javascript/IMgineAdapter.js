var GameConfig = {"splashText":"", "splashPath":"",	"aboutText":"",	"aboutPath":"",	
				"gamePath":"", "highScoresOrdering":"asc", "rankSize":5};	

exports.setGameConfig = function (gamePath, highScoresOrdering, rankSize){
	GameConfig.gamePath = gamePath;
	GameConfig.highScoresOrdering = highScoresOrdering;
	GameConfig.rankSize = rankSize;
	
	require(GameConfig.gamePath).setGameConfig (GameConfig);
};

exports.getGameConfig = function(config){
	try {
		return GameConfig[config];
	}
	catch (err) { 
		console.log(err.message);
	}
}

var GameStatus = {};
var HighScores = {};
			
exports.startGameStatus = function(jidServer, jidClient){
	if (GameStatus[jidServer] === null || GameStatus[jidServer] === undefined) {
		GameStatus[jidServer] = {};
		HighScores[jidServer] = {};
	}
	
	GameStatus[jidServer][jidClient] = {
		"message":"", "imagePath":"", "promptText":"", "menuText":"",
		"option1":"", "option2":"", "option3":"", "option4":"", "option5":"",
		"endMessage":"", "score":"", "highScorePosition":0, "highScoreText":""
	};
	
	require(GameConfig.gamePath).startGameStatus(jidServer, jidClient, GameStatus[jidServer][jidClient]);
}
	
	
exports.getGameStatus = function(jidServer, jidClient, status){
	try {
		return GameStatus[jidServer][jidClient][status];
	}
	catch (err) { 
		console.log(err.message);
	}
}

exports.updateGameStatus = function(jidServer, jidClient, command){
	try {
		require(GameConfig.gamePath).updateGameStatus(jidServer, jidClient, GameStatus[jidServer][jidClient], command);
		
		var gameStatus = GameStatus[jidServer][jidClient];
		
		if (gameStatus.endMessage != ""){
			gameStatus.highScorePosition = 1;
			
			var highScores = HighScores[jidServer];
			var keysSorted = null;
			
			if (GameConfig.highScoresOrdering.toLowerCase() == "asc")
				keysSorted = Object.keys(highScores).sort(function(a,b){highScores[a]-highScores[b]});
			else
				keysSorted = Object.keys(highScores).sort(function(a,b){highScores[b]-highScores[a]});
							
			for (i in keysSorted)
				if (keysSorted[i] < gameStatus.score)
					gameStatus.highScorePosition++;					
		}
	}
	catch (err) { 
		console.log(err.message);
	}
}


exports.storeHighScore = function(jidServer, jidClient, rankName){
	//try {
		
		console.log("rankName:"+rankName);
		console.log("score:"+GameStatus[jidServer][jidClient].score);
		HighScores[jidServer][rankName] = GameStatus[jidServer][jidClient].score;
		
	/*}
	catch (err) { 
		console.log(err.message);
		
		try {
			HighScores[jidServer][jidClient] = parseInt(highScore);
		}
		catch (err) { 
			console.log(err.message);
		}
	}*/
}

exports.getHighScores = function(jidServer){
	//try {
		var result = "## High Scores ## \n";
		
		
		if (HighScores[jidServer] !== null && HighScores[jidServer] !== undefined){
			var highScores = HighScores[jidServer];
			var keysSorted = null;
			
			if (GameConfig.highScoresOrdering.toLowerCase() == "asc")
				keysSorted = Object.keys(highScores).sort(function(a,b){highScores[a]-highScores[b]});
			else
				keysSorted = Object.keys(highScores).sort(function(a,b){highScores[b]-highScores[a]});
			
			var counter = 1;
			var rankSize = GameConfig.rankSize;
			
			for (i in keysSorted) 
				if (rankSize > 0) {
					result += counter+"- "+keysSorted[i]+" ("+highScores[keysSorted[i]]+")\n";
					counter++;
					rankSize--;
				}
		}
		return result;
	/*}
	catch (err) { 
		console.log(err.message);
	}*/
}
							
					