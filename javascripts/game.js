
//global variables
var animalColor = ["brown", "yellow", "pink", "white"];
var tileNumX = 7; //7*6
var tileNumY = 6;
var tileWidth = 71;
var tileHeight = 62;
var moveTime = 400;
var fadeTime = 400;
var moves = 10;     //Player Moves
var lives = 3;     //Player Lives
var level = 1;     //Player Level
var toDels =0;     //Amount of Animals that Disappeared
var posEx,posEy;
//2D Array stores reference of Animal.
var animalMatrix = new Array();
for ( i = 0; i < tileNumX; i++) {
	animalMatrix[i] = new Array();
}

var selectedAnimal = undefined;//store Animal that selected by Mouse
var moveable =false;
//ready
$(document).ready(function() {
	init();
	animalChain();
	beforeBegin();
});

//Animal Class
function Animal(color, tileX, tileY) {
	var that = this;
	this.color = color;
	this.tileX = tileX;
	this.tileY = tileY;
	this.selected = false;
	//JQ is the HTML elem of Animal
	this.JQ = $("<div></div>");
	this.JQ.addClass("animal").addClass(animalColor[this.color]);
	this.JQ.css("top", (tileHeight * this.tileY + "px")).css("left", (tileWidth * this.tileX + "px"));

	//move function, simply move the Animal
	this.move = function(tileX, tileY) {
		var tarLeft = ((tileX > that.tileX) ? "+=" : "-=") + Math.abs(tileX - that.tileX) * tileWidth + "px";
		var tarTop = ((tileY > that.tileY) ? "+=" : "-=") + Math.abs(tileY - that.tileY) * tileHeight + "px";
	
		that.JQ.animate({
			left : tarLeft,
			top : tarTop
		}, moveTime, function() {

		});
	};

	//reposition function, move and set Tile data
	this.reposition = function(tileX, tileY) {
		that.move(tileX, tileY);
		that.setTile(tileX, tileY);
	};

	//setTile function, set datamembers and set global reference
	this.setTile = function(tileX, tileY) {
		that.tileX = tileX;
		that.tileY = tileY;
		animalMatrix[tileX][tileY] = that;
	
	};

	//change select status
	this.setSelect = function(bool) {
		if (bool) {
			that.JQ.addClass("selected");
			that.JQ.css("background-image",that.JQ.css("background-image").toString().replace(new RegExp(".png"), "_on.png"));
			selectedAnimal = that;
		} else {
			that.JQ.removeClass("selected");
			that.JQ.css("background-image",that.JQ.css("background-image").toString().replace(new RegExp("_on.png"), ".png"));
		}
	};

	//selection handling
	this.JQ.click(function() {
		
		if (selectedAnimal) {
			if (selectedAnimal == that) {
				selectedAnimal.setSelect(false);
				that.setSelect(false);
				selectedAnimal = undefined;
			} else {
				if (isAdjunct(that)) {
					swap(that, selectedAnimal);
					selectedAnimal.setSelect(false);
					that.setSelect(false);
					selectedAnimal = undefined;
				} else {
					selectedAnimal.setSelect(false);
					that.setSelect(true);
					selectedAnimal = that;
				}
			}
		} else {
			that.setSelect(true);
		}
	});
	return this; //return a reference of this


}

function beforeBegin() {//start button
 	var oBeginDiv = $("<div>");
 	oBeginDiv.addClass("beforeBegin");
 	$('#stage').append(oBeginDiv);
 
	oBeginDiv.html("<div class='mask' id='start'>START GAME</div><div class='info' id='small'>This is a game test.</div>");
 							
 							$('#start').click(function(){

 								//init();
								//animalChain();
 								$('.beforeBegin').eq(0).remove() ;
 							})
 			
 }

function nextLevel() {//游戏胜利 Game win
 		beforeBegin();
 		$("#start").html("OK");
 		$("#small").html("You won, play again?");
		$('#start').click(function(){
			init();
			animalChain();
 			beforeBegin(); 			
 		})
 			
 }

function gameOver() {//游戏结束 Game over
 		beforeBegin();
 		$("#start").html("Game Over");
 		$("#small").html("You lost, play again?");
		$('#start').click(function(){
			init();
			animalChain();
 			beforeBegin();			
 		})
 			
 }

function isAdjunct(animal) {
	if (!selectedAnimal) {
		return false;
	}
	var a = Math.abs(animal.tileX - selectedAnimal.tileX);
	var b = Math.abs(animal.tileY - selectedAnimal.tileY);
	if ((a == 1 && b == 0) || (a == 0 && b == 1)) {
		return true;
	}
	return false;
}

function swap(animal1, animal2) {
	var x1 = animal1.tileX;
	var y1 = animal1.tileY;
	var x2 = animal2.tileX;
	var y2 = animal2.tileY;
	animal1.reposition(x2, y2);
	animal2.reposition(x1, y1);

	var dels = checkChain();
	if(dels==0)
	{
	  animal1.reposition(x1, y1);
	  animal2.reposition(x2, y2);
		

	}else{
		console.log(dels)
		toDels+=dels;
		setTimeout(animalChain,moveTime);
		console.log($("#progress").outerWidth())
		if (toDels<35) {
			
			$("#progress").animate({width:$("#progress").outerWidth() +  dels * 14 + 'px'});
				if (moves>1) {
		
					moves--;
					
				}else if (lives>0){
					moves = 10;
					lives--;
					
				 }else if(lives<=0){
		 	          gameOver();
		 }	 
				$("#lives").html(lives);
				$("#moves").html(moves);  
		 }else if (toDels>=35) {
		 	$("#progress").animate({width:$("#progress").outerWidth() +  dels * 14 + 'px'});
		 	level++;
		 	$("#level").html(level);
		 	nextLevel();
		 };
		
	}
}

//Repeat map class for handling repeatness of Animal, use in Animal Chain.
function repeatMap(repeatX, repeatY) {
	this.repeatX = repeatX;
	this.repeatY = repeatY;
	return this;

}

function animalChain() {
	var flagMatrix = new Array();
	for ( i = 0; i < tileNumX; i++) {
		flagMatrix[i] = new Array();
	}
	for ( x = 0; x < tileNumX; x++) {
		for ( y = 0; y < tileNumY; y++) {
			var repeatX = 0;
			var repeatY = 0;
			if (x > 0) {
				repeatX = (animalMatrix[x][y].color == animalMatrix[x-1][y].color) ? flagMatrix[x-1][y].repeatX + 1 : 0;
				if (repeatX > 1) {
					var i = repeatX;
					
					for (i; i > 0; i--) {
						flagMatrix[x-i][y].repeatX = repeatX;
					}
				}
			}
			if (y > 0) {
				repeatY = (animalMatrix[x][y].color == animalMatrix[x][y - 1].color) ? flagMatrix[x][y - 1].repeatY + 1 : 0;
				if (repeatY > 1) {
					var i = repeatY;
					
					for (i; i > 0; i--) {
						flagMatrix[x][y - i].repeatY = repeatY;
					}
				}
			}
			flagMatrix[x][y] = new repeatMap(repeatX, repeatY);

			
		}
	}
	var flag = false;
	 for ( x = 0; x < tileNumX; x++) {
	 	for ( y = 0; y < tileNumY; y++) {
	 		if (flagMatrix[x][y].repeatX > 1 || flagMatrix[x][y].repeatY > 1) {
	 			
	 			animalMatrix[x][y].JQ.fadeOut(fadeTime); 			
	 			animalMatrix[x][y] = undefined;
	 			flag = true;
	 		}
	 	}
	 }
	if (flag)
		{
			gravity();
		}

}


function checkChain(){

var countX =0;
var countY =0;
var flagMatrix = new Array();
	for ( i = 0; i < tileNumX; i++) {
		flagMatrix[i] = new Array();
	}
	for ( x = 0; x < tileNumX; x++) {
		for ( y = 0; y < tileNumY; y++) {
			var repeatX = 0;
			var repeatY = 0;
			if (x > 0) {
				
				repeatX = (animalMatrix[x][y].color == animalMatrix[x-1][y].color) ? flagMatrix[x-1][y].repeatX + 1 : 0;

				if (repeatX > 1) {
					
					var i = repeatX;
					for (i; i > 0; i--) {

						flagMatrix[x-i][y].repeatX = repeatX;
					}
				}
			}
			
			if (y > 0) {
				
				repeatY = (animalMatrix[x][y].color == animalMatrix[x][y - 1].color) ? flagMatrix[x][y - 1].repeatY + 1 : 0;
				
				if (repeatY > 1) {
					
					var i = repeatY;
					for (i; i > 0; i--) {
						flagMatrix[x][y - i].repeatY = repeatY;
					}
				}
				
			}

			flagMatrix[x][y] = new repeatMap(repeatX, repeatY);
			
		}

	}
	
	 for ( x = 0; x < tileNumX; x++) {
	 	for ( y = 0; y < tileNumY; y++) {
	 		if (flagMatrix[x][y].repeatX > 1) {

	 			countX++;

	 		}else if (flagMatrix[x][y].repeatY > 1) {
	 			 			
	 			countY++;
	 		};
	 		
	 	}
	 }

	return countY+countX;
};
//make Animals falling down
function gravity() {
	for ( x = 0; x < tileNumX; x++) {
		var hole = 0;
		for ( y = tileNumY - 1; y >= 0; y--) {
			if (!animalMatrix[x][y]) {
				hole++;

			} else {
				animalMatrix[x][y].reposition(x, y + hole);
			}
		}

		for ( i = 0; i < hole; i++) {
			var color = Math.floor(Math.random() * 4);
			var animal = new Animal(color, x, i-hole);
			$("#grid").append(animal.JQ);
			animal.JQ.css("display","none");
			animal.reposition(x,i);
			animal.JQ.fadeIn(fadeTime);
		}
	}
	setTimeout(animalChain,moveTime);
}

//Initialize the game
function init() {

  $("#progress").animate({width:'0px'},0);
  $(".animal").each(function(){
      	$(this).remove();
    });
	moves=10;
	lives=3;
	level=1;
	toDels=0;
	$("#lives").html(lives);
	$("#moves").html(moves);
	$("#level").html(level);

	for ( x = 0; x < tileNumX; x++) {
		for ( y = 0; y < tileNumY; y++) {
			var color = Math.floor(Math.random() * 4);
			var animal = new Animal(color, x, y);
			$("#grid").append(animal.JQ);
			animalMatrix[x][y] = animal;
		}
	}
}