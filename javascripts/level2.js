
function createjscssfile(filename, filetype){
if (filetype=="js"){
var fileref=document.createElement('script')
fileref.setAttribute("type","text/javascript")
fileref.setAttribute("src", filename)
}
else if (filetype=="css"){
var fileref=document.createElement("link")
fileref.setAttribute("rel", "stylesheet")
fileref.setAttribute("type", "text/css")
fileref.setAttribute("href", filename)
}
return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype,callback){
var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
var allsuspects=document.getElementsByTagName(targetelement)
for (var i=allsuspects.length; i>=0; i--){
if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
   var newelement=createjscssfile(newfilename, filetype)
   allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
}
}

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
			$("#stage").css("background-image","url(images/GameBoard3.png)");
	$("#grid1").css({

				"left": "27px",
	"top": "145px",
	"width":"636px",
	"height":"383px"}
		);


			replacejscssfile("javascripts/level2.js", "javascripts/level3.js", "js");
	          	$("#grid2").remove();
				var grid1 = new Grid(g1,9,6);


			grid1.init();

	
			grid1.animalChain();	



 		})
 			
 }

function gameOver() {//游戏结束 Game over
 		beforeBegin();
 		$("#start").html("Game Over");
 		$("#small").html("You lost, play next?");
		$('#start').click(function(){
				var grid2 = new Grid(g2,3,6);
	var grid1 = new Grid(g1,4,6);
	grid1.init();
	grid2.init();
	
	grid1.animalChain();
	grid2.animalChain();
 			beforeBegin();			
 		})
 			
 }

var moves = 10;     //Player Moves
var lives = 3;     //Player Lives
var level=2;     //Player Level
var toDels =0;     //Amount of Animals that Disappeared
$(document).ready(function() {

  	$("#grid2").css("display","block");



 	var grid1 = new Grid(g1,4,6);
 	var grid2 = new Grid(g2,3,6);
 	grid1.init();
 	grid2.init();

 	grid1.animalChain();
 	grid2.animalChain();
 	beforeBegin();
});


function Grid(grid,tileNumX,tileNumY){
//global variables
var self = this;
//var that = this;
this.tileNumX=tileNumX;
this.tileNumY=tileNumY;
this.grid = grid;
var animalColor = ["brown", "yellow", "pink", "white","brownfat"];
var tileWidth = 71;
var tileHeight = 62;
var moveTime = 400;
var fadeTime = 300;
var selectedAnimal = undefined;//store Animal that selected by Mouse




//2D Array stores reference of Animal.

	var animalMatrix = new Array();
for ( i = 0; i < tileNumX; i++) {
	animalMatrix[i] = new Array();
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
		 	//level++;
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
	var showimg = "<img class='boom' src='images/explosion.gif' />";
	var flagEat = new Array();
		for ( i = 0; i < tileNumX; i++) {
		flagEat[i] = new Array();
	}
	var flagMatrix = new Array();
	for ( i = 0; i < tileNumX; i++) {
		flagMatrix[i] = new Array();
	}
	for ( x = 0; x < tileNumX; x++) {
		for ( y = 0; y < tileNumY; y++) {
			var repeatX = 0;
			var repeatY = 0;
			var eatY = 0;
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
				//console.log(flagMatrix[x][y - 1])
				repeatY = (animalMatrix[x][y].color == animalMatrix[x][y - 1].color) ? flagMatrix[x][y - 1].repeatY + 1 : 0;
				//eatY = (animalMatrix[x][y].color==3&&animalMatrix[x][y-1].color==0) ?  1 : 0;
				if (animalMatrix[x][y].color==3&&animalMatrix[x][y-1].color==0) {
					eatY = 1;
					$("<img src='images/zImg_0_Hungry.png' />").appendTo(animalMatrix[x][y-1].JQ);
					animalMatrix[x][y-1].JQ.find('img').css("z-index",99);
					
					animalMatrix[x][y-1].JQ.find('img').fadeOut(3000);

					animalMatrix[x][y-1].JQ.addClass("fat");

				}else{
					eatY = 0;
				}
				//console.log(flagEat[y - 1].eatY )
				// if (eatY > 0) {
				// 	var i = eatY;
					
				// 	for (i; i > 0; i--) {
				// 		flagMatrix[x][y - i].eatY = eatY;
				// 	}
				// }
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
	 	for ( y = 0; y < tileNumY; y++) {
	 		
	 		if (flagEat[x][y].eatY>0) {
	 			self.sound("BearEatSeal")
	 			//animalMatrix[x][y].JQ.append(showimg);
	 			animalMatrix[x][y].JQ.addClass("expo")
				animalMatrix[x][y].JQ.fadeOut(fadeTime, function(){
    $(this).remove()}); 			
	 			animalMatrix[x][y] = undefined;
	 			flag = true;

	 				 			
	 		}else if (flagMatrix[x][y].repeatX > 1 || flagMatrix[x][y].repeatY > 1) {
	 		 	
	 			//animalMatrix[x][y].JQ.append(showimg);
	 			animalMatrix[x][y].JQ.addClass("expo")
	 		 	animalMatrix[x][y].JQ.fadeOut(fadeTime, function(){
    $(this).remove()}); 			
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
	 			if(animalMatrix[x][y].JQ.hasClass("fat")){
	 				countX+=2;
	 			}else
	 			countX++;
	 			console.log(countX)
	 		}else if (flagMatrix[x][y].repeatY > 1) {
	 			if(animalMatrix[x][y].JQ.hasClass("fat")){
	 				countY+=2;
	 			}else	 			 			
	 			countY++;
	 			console.log(countY)
	 		};
	 		
	 	}
	 }
	 console.log(countY+countX)
	return countY+countX;
};
//make Animals falling down
this.gravity = function () {
	
	for ( x = 0; x < tileNumX; x++) {
		var hole = 0;
		for ( y = tileNumY - 1; y >= 0; y--) {
			if (!animalMatrix[x][y]) {
				hole++;

			} else {
				//animalMatrix[x][y].JQ.css("backgroundImage","url(images/zImg_0_Hungry.png)");
				animalMatrix[x][y].reposition(x, y + hole);
			}
		}

		for ( i = 0; i < hole; i++) {
			var color = Math.floor(Math.random() * 4);
			var animal = new Animal(color, x, i-hole);
			
				grid.append(animal.JQ);
			
				//$("#grid2").append(animal.JQ);
			
			
			animal.JQ.css("display","none");
			animal.reposition(x,i);
			animal.JQ.fadeIn(fadeTime);
		}
	}
	setTimeout(this.animalChain(),moveTime);
}

//Initialize the game
this.init = function () {
$("#record").animate({width:'0%'});
 grid.children(".animal").each(function(){
     	$(this).remove();
   });
	moves=10;
	lives=3;
	level=2;
	toDels=0;
	$("#lives").html(lives);
	$("#moves").html(moves);
	$("#level").html(level);
			$("#progress").attr("some-attribute-name",toDels+"/100");
		$("#record").attr("some-attribute-name",toDels+"/100");
	for ( x = 0; x < tileNumX; x++) {
		for ( y = 0; y < tileNumY; y++) {
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
			
			that.JQ[0].style.cssText +=";background-image:"+that.JQ.css("background-image").toString().replace(new RegExp(".png"), "_on.png")+" !important;";　
			//that.JQ.css("cssText","background-image:"+that.JQ.css("background-image").toString().replace(new RegExp(".png"), "_on.png")+" !important");
			selectedAnimal = that;
		} else {
			that.JQ.removeClass("selected");
			that.JQ[0].style.cssText +=";background-image:"+that.JQ.css("background-image").toString().replace(new RegExp("_on.png"), ".png")+" !important;";
			//that.JQ.css("cssText","background-image:"+that.JQ.css("background-image").toString().replace(new RegExp("_on.png"), ".png"));
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