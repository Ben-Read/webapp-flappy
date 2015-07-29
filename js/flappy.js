// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score = 0;
var labelScore;
var player;
var pipes = [];
var game;
var splashDisplay;
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)

/*
 * Loads all resources for the game and gives them names.
 */


jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    //jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    //event_details.preventDefault();
});

function preload() {
    game.load.image("playerImg", "../assets/pipe_blue.png");
    game.load.image("backgroundImg", "../assets/new.jpg");
    game.load.image("explosion", "../assets/explosion2.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipe2-body.png");
    game.load.image("background2", "../assets/bg.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    var background = game.add.image(0, 0, "background2");
    background.width = 1500;
    background.height = 400;
    alert(">>>DISCLAIMER<<< \rWe will accept no responsibility for any injuries or damage to possessions that occur whilst playing THE game")
    splashDisplay = game.add.text(100,200, "Press ENTER to start, SPACEBAR to flap", {font: "30px STENCIL", fill: "#00FFFF"});
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.add(start);

}


function clickHandler(event) {
    alert("The game is paused");

}

function spaceHandler() {
    game.sound.play("score");

}

function changeScore() {
    score=score + 1;
    labelScore.setText(score.toString());

}

function moveRight() {
    player.x=player.x+10

}

function generatePipe() {
    var gap = game.rnd.integerInRange(0 ,6);
    for (var count = -2; count < 8; count++) {
        if (count != gap && count != gap+1) {
            addPipeBlock(900, count * 50);
        }
    }
    changeScore();
}


function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}

function playerJump() {
    player.body.velocity.y = -200;
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade
        .overlap(player, pipes, gameOver);
    //player.rotation = Math.atan(player.body.velocity.y / 500);
    /*if(player.body.y < -100) {
        gameOver();
    }
    if(player.body.y > 400){
        gameOver();
    }*/

}

function gameOver() {
    beforeStopGame();
    stopGame();
}

function beforeStopGame() {
    explosion=game.add.image(player.x, player.y, "explosion");
    explosion.anchor.setTo(0.5, 0.5);
    player.kill();
    labelDeath = game.add.text(300, 200, "GAME OVER", {font: "30px STENCIL", fill: "#FFFFFF"})
    $("#score").val(score.toString());
    $("#greeting").show();
}

function stopGame() {
    game.paused=true
}



function main() {
    if (game == null) {
        game = new Phaser.Game(1500, 400, Phaser.AUTO, 'game', stateActions);
    }
}

$.get("/score", function(scores){
    console.log("Data: ",scores);
});

$.get("/score", function(scores){
    console.log("sorting scores");
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
                "<li>" +
                scores[i].name + ": " + scores[i].score +
                "</li>");
    }
});

function start() {
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    splashDisplay.destroy();
    // set the background colour of the scene

    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 1500;
    background.height = 400;

    player = game.add.sprite(50, 140, "playerImg");
    player.width = 25;
    player.height = 25;
    game.input
            .onDown
            .add(clickHandler);

    game.input
            .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(spaceHandler);

    labelScore = game.add.text(20, 20, "0", {fill:"#FFFFFF"});


    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
            .onDown.add(moveRight);

    //generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = -300;
    player.body.gravity.y = 600;

    game.input.keyboard
            .addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.add(playerJump);

    pipeInterval = 1.75;
    game.time.events
            .loop(pipeInterval * Phaser.Timer.SECOND,
            generatePipe);

    player.anchor.setTo(0.5, 0.5)
}