
var worldSize=900;
var blockSize=worldSize/6;
var sideSize=blockSize*0.95;

var shown=false;
var curCube;

function setup(){
  createCanvas(worldSize, worldSize, WEBGL);
  
  ortho(-worldSize/2, worldSize/2,
  	worldSize/2, -worldSize/2,
  	-100, 1500);

   curCube = new Cube();

   var posmoves = "rlbfud";

   // for (var i=0; i<1000; i++) {
   //    curCube.addMoves(posmoves.charAt(Math.round(random(5))));
   // }

   this.moveSlider = createSlider(PI/2000, PI/5, PI/50, 0.001);  
   cubeRotation = createVector(random(1), random(1), random(1));

   
}



var angle=0;
var cubeRotation;
var pause=0;



function draw(){


	background(51);
	angle+=PI/300;
	
  
 // ambientMaterial(250);

 


  cubeRotation.add(createVector(random(1), random(1), random(1)).mult(0.001));
	cubeRotation.normalize();
  rotate(angle, cubeRotation);

  if (curCube.moves.length==0) {
    if (pause>400) {
      addCombinationMoves(curCube);
      pause=0;
    } else {
      pause++;
    }
  }


	curCube.draw();
  pointLight(255, 255, 255, mouseX, mouseY, 500);
 

}



function getRandomCombination () {
   
   switch (Math.round(random(11))) {
    case 0: return "2r2l2b2f2d2u"; //chessboard
    case 1: return "2U2F2RU'2LdbR'BR'BR'D'2Lu'"; //cube in cube
    case 2: return "RLFBRLFBRLFB"; //zigzar
    case 3: return "RLFBRLFBRLFB2u2d"; //snake
    case 4: return "B2fD'2rFDB'FD'UF'd'2lf2du'"; //cross
    case 5: return "2u2r2fd'u2b2ld'u'"; //6 T's
    case 6: return "r'2f2u2rb'2ld'2br'2b2lb2ru'2r"; //circles
    case 7: return "rfb'd'2fdbf'r'2fu2ru'd2fd'"; //snake 2
    case 8: return "u2bldb'fl'du'l'rf'2dr'"; //worm
    case 9: return "u'2l2u2ru'2bl'bdr'b'l'b'2db'ldb'u'"; //Screw
    case 10: return "ur2ur2fl2urf'b'2rdr'l2u2f2df2rd"; //reverse
    default: return ""; //just solved cube
   }
}

var lastComb="";

function addCombinationMoves(cube) {
   
  
  cube.addBackwardsMoves(lastComb);
  lastComb = getRandomCombination();
  cube.addMoves(lastComb);

   // var moves = "RLDBUF";
   // for (var i=0; i<10000; i++) {
   //   cube.addMove(moves.charAt(random(6)));
   // }
}







