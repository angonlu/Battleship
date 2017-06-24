// Initialize Firebase
  var config = {
    apiKey: "AIzaSyC5JhJbodE2o9gJ7Rhql9R4mWpRS_7bEPg",
    authDomain: "cazzle-e4640.firebaseapp.com",
    databaseURL: "https://cazzle-e4640.firebaseio.com",
    projectId: "cazzle-e4640",
    storageBucket: "cazzle-e4640.appspot.com",
    messagingSenderId: "284034470468"
  };
  firebase.initializeApp(config);
 
var database = firebase.database();
var waterGif = 'https://media1.giphy.com/media/ba2MagE3WGZO0/giphy.gif';
// var missGif = 'https://media3.giphy.com/media/xT0GqcCJJJH12hJvGM/giphy.gif';
var shipCount1 = 0;
var shipCount2 =0;
var hitCount = 0;
var misses = 0;
var currentPlayers = "null";
var currentTurn = "null";
var playerNum = null;
// var player2 = "null";
var playerCounter = 0;
var isPlaying = false;
// var playerOneExists = "null";
// var playerTwoExists = "null";
var playersRef = database.ref("players");
var playerOneArray = [];
var playerTwoArray = [];
  
var playerOneArrayDefault = [
        [
            {col: 'a', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false,  hit: "", miss: false, missGif:""} 
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""}
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""}
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""}
        ],
    ];

    var playerTwoArrayDefault = [
        [
            {col: 'a', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false,  hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false,  hit: "", miss: false, missGif:""}, 
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
        ],
        [
            {col: 'a', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'b', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""},
            {col: 'c', hasShip: false, hit: "", miss: false, missGif:""}
        ]
    ];

database.ref().set(""); //need a "NewGame" button that will allow anyone to reset the game. 
// ^^^ this causes firebase to refresh everytime the player refreshes or opens new page. Need to make it so that it renders the updated board.  
// database.ref().push(playerOneArray);
// database.ref().push(playerTwoArray);

$(document).on("click", ".joinBtn", function(event){
    event.preventDefault();
    database.ref().once("value", function(snapshot){
        playerCounter = snapshot.numChildren();
        console.log(snapshot.numChildren());    
    })

if(playerCounter === 0){
    database.ref("playerOne").set(playerOneArrayDefault);
    sessionStorage.setItem("player", "playerOne");
    // When player joins, hides join button to prevent from user using the same machine to hit the join button again. 
    if (sessionStorage.getItem("player") === "playerOne"){
        $(".joinBtn").hide();   
    }
}

if(playerCounter === 1){
    database.ref("playerTwo").set(playerTwoArrayDefault);
    sessionStorage.setItem("player", "playerTwo");
    if (sessionStorage.getItem("player") === "playerTwo"){
        $(".joinBtn").hide();
    }   
            
}

if (playerCounter === 2) {
    sessionStorage.setItem("player", "");
    alert("Cannot Join")
}

// if(playerNum === null && isPlaying) {
//  if(newSnap.val().playerOne && newSnap.val().playerTwo === undefined){
//      playerNum = 1;
//  }
//  else{
//      playerNum = 2;
//  }
// }

})

// database.ref().set({
//  playerOne: playerOneArray,
//  playerTwo: playerTwoArray
// })

// When something changes in firebase, capture changes, and render board
database.ref().on("value", function(newSnap){

    //returns the array as empty until both players have joined and both boards have showed up on html otherwise an error message shows up in console.log making playerTwoArray undefined until player2 hits join.
    playerOneArray = newSnap.val().playerOne || [];
    playerTwoArray = newSnap.val().playerTwo || [];


    if(newSnap.val() === ""){
        return;
    }

    // if(playerNum === null && isPlaying) {
    //  if(newSnap.val().playerOne && newSnap.val().playerTwo === undefined){
    //      playerNum = 1;
    //  }
    //  else{
    //      playerNum = 2;
    //  }
    // }

    // search playerOneArray to see if they placed 2 ships
    var numP1Ships = 0;
    var numP2Ships = 0;

    for(var i =0; i < playerOneArray.length; i++) {
        for(var j = 0; j < playerOneArray[i].length; j++) {
            if(playerOneArray[i][j].hasShip) {
                numP1Ships++;
            }
        }
    }
    //search playerTwoArray to see if they placed 2 ships
    for (var i = 0; i < playerTwoArray.length; i++) {
        for(var j = 0; j < playerTwoArray[i].length; j++) {
            if(playerTwoArray[i][j].hasShip) {
                numP2Ships++;
            }
        }
    }
    //if both players have set ships run the playGame function
    if (numP1Ships === 2 && numP2Ships === 2 && !isPlaying) {
        isPlaying
        playGame(); 
    }

    //won't show the other board until both players have joined. 
    if(sessionStorage.getItem("player") === "playerOne") {
        setPlayerOneBoard();    
    } else {
        setPlayerTwoBoard();
        
    }

})

// database.ref('currentPlayer').on("value", function(newSnap){
//  console.log(newSnap.val())
// })

//render opponents board - initialize a board with just water gifs. Only show hit's or misses on other side of player's side. 
function renderOtherBoard(player, playerClass, playerArray){

    var board="<table border=2>";

    // needs to be dynamic what board to use
    for (var y=0; y<playerArray.length; y++ ) {        // for each row
        board += "<tr>";
        for (var x=0; x<playerArray[y].length; x++ ) { // for each clm
            var waterGif = 'https://media1.giphy.com/media/ba2MagE3WGZO0/giphy.gif';
            if(playerArray[y][x].hit != "") {
              waterGif = playerArray[y][x].hit;
            }
            if (playerArray[y][x].miss) {
                waterGif = playerArray[y][x].missGif
            }
                board += "<td "+ "class=" + player + 
                " data-row='"+ y + "'"+
                " data-col='"+ x + "'>" +
                   " <img src='" +
                   waterGif +
                   "' /></td>";
        }
        board += "</tr>";
    }
    board += "</table>";
    $(playerClass).html(board);
}

// Renders board onto page, each tile with a waterGif image.
function setPlayerOneBoard(){

    var board="<table border=2>";

    // needs to be dynamic what board to use
    for (var y=0; y<playerOneArray.length; y++ ) {        // for each row
        board += "<tr>";
        for (var x=0; x<playerOneArray[y].length; x++ ) { // for each clm
            var waterGif = 'https://media1.giphy.com/media/ba2MagE3WGZO0/giphy.gif';
            if(playerOneArray[y][x].hasShip) {
              waterGif = playerOneArray[y][x].hasShip;
            }
            if (playerOneArray[y][x].miss) {
                waterGif = playerOneArray[y][x].missGif
            }
                board += "<td "+ "class='p-1'" + 
                " data-row='"+ y + "'"+
                " data-col='"+ x + "'>" +
                   " <img src='" +
                   waterGif +
                   "' /></td>";
        }
        board += "</tr>";
    }
    board += "</table>";
    $("#player-one-board").html(board);
}
//renders playerTwo's board 
function setPlayerTwoBoard(){

//Error occuring in console.log since playerTwoArray = newSnap.val().playerTwo; was not defined UNTIL player2 joins game. This code removes that error until player2 has joined.
    if (typeof playerTwoArray === "undefined") {
        return;
    }

    var board="<table border=2>";

for (var y=0; y<playerTwoArray.length; y++ ) {        // for each row
    board += "<tr>";
    for (var x=0; x<playerTwoArray[y].length; x++ ) { // for each clm
        var waterGif = 'https://media1.giphy.com/media/ba2MagE3WGZO0/giphy.gif';
        if(playerTwoArray[y][x].hasShip) {
          waterGif = playerTwoArray[y][x].hasShip;
        }
        if (playerTwoArray[y][x].miss) {
                waterGif = playerTwoArray[y][x].missGif
        }
            board += "<td "+ "class='p-2'" + 
            " data-row='"+ y + "'"+
            " data-col='"+ x + "'>" +
               " <img src='" +
               waterGif +
               "' /></td>";
    }
    board += "</tr>";
}
board += "</table>";
$("#opponent-board").html(board);

}

// function myBoard(){
//  if(player1){
//      return playeroneboard
//  }
//  else{
//      return player2board
//  }
// }

// function enemyBoard(){
//  if(i am player one){
//      return twoplayerboard
//  }
//  else{
//      return playeroneboard
//  }
// }

//Setting ships on player 1's board
$('body.newGame').on("click", ".p-1", function(event) {
            event.preventDefault();
            $(this).attr("data-ship", "ship");
            console.log(this);
        // On Click, captures the coordinates of the tile clicked.
        
            var row = $(this).attr("data-row");
            // console.log(row);
            var col = $(this).attr("data-col");
            // console.log(col);
            var ship = "https://media.giphy.com/media/rbMT3rRP5vybm/giphy.gif";
            shipCount1++;
            if (shipCount1 === 2){
                // setBoard1();
                
            }
            else if (shipCount1 > 2) {
                return;
            }

            if (sessionStorage.getItem("player") === "playerOne"){
                // Changes the value of that specific part of the array
               playerOneArray[row][col].hasShip=ship;
  
                // sends changes to firebase.
                database.ref('playerOne').set(playerOneArray);
        
            }
            
})

//Setting ships on player2's board
        $('body.newGame').on("click", ".p-2", function(event) {
            event.preventDefault();
            $(this).attr("data-ship", "ship");
        // On Click, captures the coordinates of the tile clicked.
        
            var row = $(this).attr("data-row");
            // console.log(row);
            var col = $(this).attr("data-col");
            // console.log(col);
            var ship = "https://media.giphy.com/media/rbMT3rRP5vybm/giphy.gif";
            shipCount2++;      

            if (shipCount2 === 2){
                              
            }
            else if ( shipCount2 > 2){
                return;
            }
            if (sessionStorage.getItem("player") === "playerTwo"){
             // Changes the value of that specific part of the array
            playerTwoArray[row][col].hasShip=ship;

            // sends changes to firebase.
            database.ref('playerTwo').set(playerTwoArray);

            }   
              
})

function playGame() {

    if (sessionStorage.getItem("player") === "playerOne"){
        renderOtherBoard("p-2", "#opponent-board", playerTwoArray)
    } else {
        renderOtherBoard("p-1", "#player-one-board", playerOneArray)
    }

    $('body').removeClass('newGame');

    //attack if there is a ship on space for player 1
    $(document).on("click", ".p-2",  function(event) {
        event.preventDefault();

        $(this).attr("data-hit", "hit");

        var row = $(this).attr("data-row");
        
        var col = $(this).attr("data-col");
         
        var hit = "https://media0.giphy.com/media/BarqgIZ0PdkQg/giphy.gif";

        var miss = "https://media2.giphy.com/media/6trotNE8bTgpW/giphy.gif";
        console.log("hi", $(this).attr("data-ship"));
        // hitCount++ 

        if($(this).attr("data-ship") === "ship"){
            hitCount++;
        } 

        if (sessionStorage.getItem("player") === "playerOne"){
            
            if(playerTwoArray[row][col].hasShip) {
                playerTwoArray[row][col].hit = hit;

            }
            else {
                 playerTwoArray[row][col].missGif = miss;
                 playerTwoArray[row][col].miss = true;
            }
                
            if(sessionStorage.getItem("player") === "playerOne" && hitCount === 2){
                // alert("Enemy ships destroyed. You Win!");
            }

            // sends changes to firebase.
            database.ref('playerTwo').set(playerTwoArray);
            
            renderOtherBoard("p-2", "#opponent-board", playerTwoArray)

        }
    })

    //attack if there is a ship on space for player 2
    $(document).on("click", ".p-1", function(event){
        event.preventDefault();

        $(this).attr("data-hit", "hit");

        var row = $(this).attr("data-row");

        var col = $(this).attr("data-col");

        var hit = "https://media0.giphy.com/media/BarqgIZ0PdkQg/giphy.gif"; 

        var miss = "https://media2.giphy.com/media/6trotNE8bTgpW/giphy.gif";

        if (sessionStorage.getItem("player") === "playerTwo"){

            if(playerOneArray[row][col].hasShip) {

                playerOneArray[row][col].hit = hit
                

            } else {
                playerOneArray[row][col].missGif = miss;
                playerOneArray[row][col].miss = true;
                
            }
        
            // if(hitCount === 2){
            //  alert("Enemy ships destroyed. You Win!");
            // }

            renderOtherBoard("p-1", "#player-one-board", playerOneArray)
        }
        database.ref('playerOne').set(playerOneArray);
    
    })
}


