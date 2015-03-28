$(document).ready(function() {

	var g1 = $("#grid1");
		
	var grid1 = new Grid(g1,9,6);


	grid1.init();

	
	grid1.animalChain();

	beforeBegin();
});




function Grid(grid,tileNumX,tileNumY){
//global variables
var self = this;
//var that = this;
this.tileNumX=tileNumX;
this.tileNumY=tileNumY;
this.grid = grid;
//var tileNumX = 4; //7*6
//var tileNumY = 6;
//Animal Class
var animalColor = ["brown", "yellow", "pink", "white","brownfat"];
var tileWidth = 71;
var tileHeight = 62;
var moveTime = 400;
var fadeTime = 300;
var selectedAnimal = undefined;//store Animal that selected by Mouse
var moveable =false;

var moves = 10;     //Player Moves
var lives = 3;     //Player Lives
var level = 1;     //Player Level
var toDels =0;     //Amount of Animals that Disappeared

//2D Array stores reference of Animal.

	var animalMatrix = new Array();
for ( i = 0; i < tileNumX; i++) {
	animalMatrix[i] = new Array();
}




function beforeBegin() {//start button
 	var oBeginDiv = $("<div>");
 	oBeginDiv.addClass("beforeBegin");
 	$('#stage').append(oBeginDiv);
 
	oBeginDiv.html("<div class='mask' id='start'>START GAME</div><div class='info' id='small'>This is a game test.</div>");
 							
 							$('#start').click(function(){

 								
 								$('.beforeBegin').eq(0).remove() ;
 							})
 			
 }

function nextLevel() {//游戏胜利 Game win
 		beforeBegin();
 		$("#start").html("OK");
 		$("#small").html("You won, play again?");
		$('#start').click(function(){
			var grid = new Grid(g1,9,6)
			grid.init();
			grid.animalChain();
 			beforeBegin(); 			
 		})
 			
 }

function gameOver() {//游戏结束 Game over
 		beforeBegin();
 		$("#start").html("Game Over");
 		$("#small").html("You lost, play again?");
		$('#start').click(function(){
			var grid = new Grid(g1,9,6)
			grid.init();
			grid.animalChain();
 			beforeBegin();			
 		})
 			
 }
this.sound = function(effect){
	if (!$("#on").hasClass('off')) {
			if (effect=="MoveAnimal"||effect=="BearEatSeal") {$('embed').remove();};
		
         	$('#stage').append('<embed class="'+effect+'" src="media/' +effect+ '.mp3" autostart="true" hidden="true" loop="false">');
	}

}
this.isAdjunct = function(animal) {
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

this.swap = function(animal1, animal2) {
	var x1 = animal1.tileX;
	var y1 = animal1.tileY;
	var x2 = animal2.tileX;
	var y2 = animal2.tileY;
	animal1.reposition(x2, y2);
	animal2.reposition(x1, y1);
	self.sound("MoveAnimal");
	var dels = self.checkChain();
	if(dels==0)
	{
	  animal1.reposition(x1, y1);
	  animal2.reposition(x2, y2);
		

	}else{

		
		toDels+=dels;

		setTimeout(self.animalChain,moveTime);

		 animal1.JQ.after("<div id='po' style='z-index:99;margin-top: 17px;color: red;font-weight: bold;width:70px;position:absolute;top:"+animal1.JQ.css('top')+";left:"+animal1.JQ.css('left')+";'>"+dels + " points</div>");
	
		if (toDels<100) {
			
			$("#record").animate({width:($("#record").outerWidth()/$("#progress").outerWidth())*100 +  dels + '%'});
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
		 }else if (toDels>=100) {
		 	toDels=100
		 	$("#record").animate({width:($("#record").outerWidth()/$("#progress").outerWidth())*100 +  dels  + '%'});
		 	level++;
		 	$("#level").html(level);
		 	nextLevel();
		 };
				$("#progress").attr("some-attribute-name",toDels+"/100");
		$("#record").attr("some-attribute-name",toDels+"/100");
	}
}

//Repeat map class for handling repeatness of Animal, use in Animal Chain.
function repeatMap(repeatX, repeatY) {
	this.repeatX = repeatX;
	this.repeatY = repeatY;
	return this;

}
function eatMap(eatY){
		this.eatY = eatY;
	return this;
}

this.animalChain = function () {
	//var showimg = "<img class='boom' src='images/explosion.gif' />";
	var tempX,tempY;
	var tempNumX = tileNumX;
	var flagEat = new Array();
		for ( i = 0; i < tileNumX; i++) {
		flagEat[i] = new Array();
	}
	var flagMatrix = new Array();
	for ( i = 0; i < tileNumX; i++) {
		flagMatrix[i] = new Array();
	}
	for ( x = 0; x < tileNumX; x++) {
		switch(x){

			case 0:
			tempY=4;
			tempX=0;
			break;
			case 1:
			tempY=3;
			tempX=4;
			break;
			case 2:
			tempY=1;
			tempX=3;
			break;	
			case 8:
			tempY=tempX=4;
			
			break;
			case 7:
			tempY=tempX=3;
			
			break;	
			case 6:
			tempY=tempX=1;
			
			break;
			case 3:
			tempY=0;
			tempX=1;
			break;
			default:
			tempY=tempX=0;
			

		}
	
		for ( y=tempY; y < tileNumY; y++) {
		
			var repeatX = 0;
			var repeatY = 0;
			var eatY = 0;
			
			if (x > 0&&y>=tempX) {
				
				repeatX = (animalMatrix[x][y].color == animalMatrix[x-1][y].color) ? flagMatrix[x-1][y].repeatX + 1 : 0;
				if (repeatX > 1) {
					var i = repeatX;
					
					for (i; i > 0; i--) {
						
						flagMatrix[x-i][y].repeatX = repeatX;
					}
				}
			}
			if (y > tempY) {

				repeatY = (animalMatrix[x][y].color == animalMatrix[x][y - 1].color) ? flagMatrix[x][y - 1].repeatY + 1 : 0;

				if (animalMatrix[x][y].color==3&&animalMatrix[x][y-1].color==0) {

					eatY = 1;
					$("<img src='images/zImg_0_Hungry.png' />").appendTo(animalMatrix[x][y-1].JQ);
												
				animalMatrix[x][y-1].JQ.find('img').css("z-index",99);
				
				animalMatrix[x][y-1].JQ.find('img').fadeOut(3000);
				//animalMatrix[x][y-1].JQ.find('img').attr("src","images/zImg_0_Fat.png"); 
				animalMatrix[x][y-1].JQ.addClass('fat');

				}else{
					eatY = 0;
				}

				if (repeatY > 1) {

					var i = repeatY;
					
					for (i; i > 0; i--) {
						flagMatrix[x][y - i].repeatY = repeatY;

					}
				}
			}
			flagMatrix[x][y] = new repeatMap(repeatX, repeatY);
			
			flagEat[x][y] = new eatMap(eatY);
			
		}
	}
	var flag = false;
	 for ( x = 0; x < tileNumX; x++) {
		switch(x){
			case 0:
			case 8:
			y=4;
			break;
			case 1:
			case 7:
			y=3;
			break;
			case 2:
			case 6:
			y=1;
			break;	
			default:
			y=0;
		}
		
	 	for ( ; y < tileNumY; y++) {
	 		
	 			 		if (flagEat[x][y].eatY>0) {

	 			//animalMatrix[x][y].JQ.append(showimg);
	 			animalMatrix[x][y].JQ.addClass("expo")
				self.sound("BearEatSeal")

				animalMatrix[x][y].JQ.fadeOut(fadeTime); 	
	 			animalMatrix[x][y] = undefined;
	 			flag = true;	 			
	 		}else if (flagMatrix[x][y].repeatX > 1 || flagMatrix[x][y].repeatY > 1) {
	 		 	
	 			//animalMatrix[x][y].JQ.append(showimg);
	 			animalMatrix[x][y].JQ.addClass("expo")
	 		 	animalMatrix[x][y].JQ.fadeOut(fadeTime); 			
	 		 	animalMatrix[x][y] = undefined;
	 		 	flag = true;
	 		  }

	 	}
	 }


	if (flag)
		{
			
			self.gravity();
			if (!$('embed').hasClass("RowComplete")) {self.sound("RowComplete");};
			
		}

}


this.checkChain=function (){

var countX =0;
var countY =0;
var flagMatrix = new Array();
	for ( i = 0; i < tileNumX; i++) {
		flagMatrix[i] = new Array();
	}
	for ( x = 0; x < tileNumX; x++) {
		switch(x){

			case 0:
			tempY=4;
			tempX=0;
			break;
			case 1:
			tempY=3;
			tempX=4;
			break;
			case 2:
			tempY=1;
			tempX=3;
			break;	
			case 8:
			tempY=tempX=4;
			
			break;
			case 7:
			tempY=tempX=3;
			
			break;	
			case 6:
			tempY=tempX=1;
			
			break;
			case 3:
			tempY=0;
			tempX=1;
			break;
			default:
			tempY=tempX=0;
			

		}
		for ( y = tempY; y < tileNumY; y++) {
			var repeatX = 0;
			var repeatY = 0;
			if (x > 0&&y>=tempX) {
				
				repeatX = (animalMatrix[x][y].color == animalMatrix[x-1][y].color) ? flagMatrix[x-1][y].repeatX + 1 : 0;

				if (repeatX > 1) {
					
					var i = repeatX;
					for (i; i > 0; i--) {

						flagMatrix[x-i][y].repeatX = repeatX;
					}
				}
			}
			
			if (y > tempY) {
				
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
		switch(x){
			case 0:
			case 8:
			y=4;
			break;
			case 1:
			case 7:
			y=3;
			break;
			case 2:
			case 6:
			y=1;
			break;	
			default:
			y=0;
		}
	 	for ( ; y < tileNumY; y++) {
	 		if (flagMatrix[x][y].repeatX > 1) {
	 			if(animalMatrix[x][y].JQ.hasClass("fat")){
	 				countX+=2;
	 			}else
	 			countX++;
	 			
	 		}else if (flagMatrix[x][y].repeatY > 1) {
	 			if(animalMatrix[x][y].JQ.hasClass("fat")){
	 				countY+=2;
	 			}else	 			 			
	 			countY++;
	 			
	 		};
	 		//animalMatrix[x][y].JQ.html("<div style='font-size:20px;color:red;position:absolute'>"+(countY+countX)+"  points</div>");
	 	}
	 }

	return countY+countX;
};
//make Animals falling down
this.gravity = function () {
	var start;
	for ( x = 0; x < tileNumX; x++) {
		switch(x){
			case 0:
			case 8:
			start=4;
			break;
			case 1:
			case 7:
			start=3;
			break;
			case 2:
			case 6:
			start=1;
			break;	
			default:
			start=0;
		}

		var hole = 0;
		for ( y = tileNumY - 1; y >= start; y--) {
			if (!animalMatrix[x][y]) {
				hole++;

			} else {
				animalMatrix[x][y].reposition(x, y + hole);
				 //if (animalMatrix[x][y].JQ.hasClass('hungry')) {
				 	//setTimeout(animalMatrix[x][y].JQ.removeClass('hungry'),500000);
				 	//setTimeout(animalMatrix[x][y].JQ.addClass('fat'),100000);

				// };
			}
		}

		for ( i = start; i < hole+start; i++) {
			var color = Math.floor(Math.random() * 4);
			
			var animal = new Animal(color, x, i-hole);
			
				grid.append(animal.JQ);
			
	
			animal.JQ.css("display","none");
			animal.reposition(x,i);
			animal.JQ.fadeIn(fadeTime);
		}
	}
	setTimeout(this.animalChain(),moveTime);
	
}

//Initialize the game
this.init = function () {

 grid.children(".animal").each(function(){
     	$(this).remove();
   });
 $("#record").animate({width:'0%'});
	moves=10;
	lives=3;
	level=3;
	toDels=0;
	$("#lives").html(lives);
	$("#moves").html(moves);
	$("#level").html(level);
			$("#progress").attr("some-attribute-name",toDels+"/100");
		$("#record").attr("some-attribute-name",toDels+"/100");
	for ( x = 0; x < tileNumX; x++) {
		
		switch(x){
			case 0:
			case 8:
			y=4;
			break;
			case 1:
			case 7:
			y=3;
			break;
			case 2:
			case 6:
			y=1;
			break;	
			default:
			y=0;
		}
		for ( ; y < tileNumY; y++) {
			var color = Math.floor(Math.random() * 4);
			var animal = new Animal(color, x, y);
			
			
				grid.append(animal.JQ);
		
				
		
			animalMatrix[x][y] = animal;
		}
	}
}


function Animal(color, tileX, tileY) {

	var that = this;

	this.grid = grid;
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
		
		//that.JQ.html("x:" + tileX + "<br/>y:" + tileY);
		//console.log(that.JQ.html())
	
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
				if (self.isAdjunct(that)) {
					self.swap(that, selectedAnimal);
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
}