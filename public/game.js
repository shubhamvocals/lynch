var userClickedPattern = [];
var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];
var level = 0;
var start = true;


$(document).keydown(function(){                                    
    while(start === true){
        nextSequence();
        start = false;
    }
});


$(".game-btn").click(function(){                                         
    var userChosenColour = this.id;                                
    userClickedPattern.push(userChosenColour);                     
    checkAnswer(userClickedPattern.length - 1);                    
    animatePress(userChosenColour);                                
    playSound(userChosenColour);                                   
});


function checkAnswer(currentLevel){                                
    if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        if(gamePattern.length == userClickedPattern.length)        
        {                       
            console.log("success");                                 
            setTimeout(nextSequence, 1000);
            userClickedPattern = [];    
        }
    }
    else{
        const highscore = $("#highscore").text();
        if(level > highscore.substring(12, highscore.length)){
            $("#highscore").text("Highscore : " + (level-1));
            $(".target-input").val(level-1);
            $(".target-button").click();
        }
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart.")
        startOver();                                                
    }
}

function startOver(){                                               
    level = 0;
    start = true;
    userClickedPattern = [];
    gamePattern = [];
}

// Start of sequence

function nextSequence(){                                            
    level++;                                                        
    $("#level-title").text("level = " + level);                     
    var randomNumber = Math.floor(Math.random()*4);                 
    var randomChosenColour = buttonColours[randomNumber];           
    gamePattern.push(randomChosenColour);                           
    $("#" + randomChosenColour).fadeOut(100).fadeIn(100);           
    playSound(randomChosenColour);                                  
    
}

function playSound(name){                                           
    var audio = new Audio("sounds/" + name + ".mp3");               
    audio.play();                                                   
}

function animatePress(currentColour){                               
    $("#" + currentColour).addClass("pressed");                     
    setTimeout(function(){                                          
        $("#" + currentColour).removeClass("pressed");              
    }, 100);
}