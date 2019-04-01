function Cube(moveSlider) {
	this.blocks = [];
	//init blocks array
	for (var i=0; i<3; i++) {
		var arrY = [];
		for (var j=0; j<3; j++) {
			var arrZ = [];
			arrY.push(arrZ);
		}
		this.blocks.push(arrY);
	}
	//fill that array with blocks
	for (var i=0; i<3; i++) {
		for (var j=0; j<3; j++) {
			for (var k=0; k<3; k++) {
				if ((i==1 && j==1)
					|| (j==1 && k==1)
					|| (i==1 && k==1)) continue;
				this.blocks[i][j][k] = new Block(i,j,k); 
			}
		}
	}

	this.centers = [];
	for (var i=0; i<6; i++) {
		this.centers[i] = new Center(i);
	}

	this.moves = [];

	this.addMove = function (move) {
		move = move.toUpperCase();
		console.log("adding move "+move);
		if (move.indexOf("2")!=-1) {
			var doubleIndexPos = move.indexOf("2");
			if (doubleIndexPos==0) {
				for (var i=0; i<2; i++) {
					this.moves.push(new Move(move.substr(1, 1)));
				}
			} else {
				for (var i=0; i<2; i++) {
					this.moves.push(new Move(move.substr(0, 1)));
				}
			}
		} else {
			this.moves.push(new Move(move));	
		}
	}

	this.getMoves = function (moves) {
		var movesArr = [];

		for (var i=0; i<moves.length; ) {
			var double=false;
			var backwards=false;
	
			if (moves.charAt(i)=='2') {double=true;}
			if (double) {
				if (moves.charAt(i+2)=="'") {
					backwards=true;
				}
			} else {
				if (moves.charAt(i+1)=="'") {
					backwards=true;
				}
			}

			var len=1;
			if (double) {
				len++;
			}
			if (backwards) {
				len++;
			}
			movesArr.push(moves.substr(i, len));
			
			i+=len;
		}
		return movesArr;
	}

	this.addMoves = function (moves) {
		var movesArr = this.getMoves(moves);
		for (var i=0; i<movesArr.length; i++) {
			this.addMove(movesArr[i]);
		}
	}

	this.addBackwardsMoves = function (moves) {
		var movesArr = this.getMoves(moves);
		for (var i=movesArr.length-1; i>=0; i--) {
			var move = movesArr[i];
			if (move.indexOf("2")!=-1) {
				this.addMove(move);
			} else {
				if (move.indexOf("'")!=-1) {
					this.addMove(move.substr(0, 1));
				} else {
					this.addMove(move+"'");
				}
			}
		}
	}
	

	this.draw = function() {

		if (this.moves.length>0) {
			var currentMove = this.moves[0];
		} else {
			var currentMove = undefined;
		}
		
		for (var i=0; i<6; i++) {
			if (currentMove==undefined || currentMove.rotatedCenter!=i) {
				this.centers[i].rotation=0;
			} else {
				this.centers[currentMove.rotatedCenter].rotation=currentMove.rotation;
			}
			this.centers[i].draw();
		}

		var rotatedBlocks = [];

		


		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				for (var k=0; k<3; k++) {
					var eachBlock = this.blocks[i][j][k];
					if (eachBlock!=undefined) {
						if (currentMove==undefined) {
							eachBlock.draw();
						} else {
							
							if (this.centers[currentMove.rotatedCenter].isRelated(eachBlock)) {
								rotatedBlocks.push(eachBlock);
							} else {
								eachBlock.draw();
							}

						}
					}
				}
			}
		}

		if (currentMove!=undefined) {
			var cen = currentMove.rotatedCenter;

			for (var i=0; i<rotatedBlocks.length; i++) {
				rotatedBlocks[i].draw(cen, currentMove.rotation);
			}

			currentMove.update()
			if (currentMove.isFinished) {
				this.applyMove(currentMove.type);
				this.moves.shift(0);
			}
		}

	}
	
	this.applyMove = function(moveType) {
		
		if (moveType.indexOf("'")!=-1) {
			var backwards=true;
		} else {
			var backwards=false;
		}

		// var rotType = moveType.indexOf("X");
		// if (rotType==-1) {
		// 	rotType = moveType.indexOf("Y");
		// }
		// if (rotType==-1) {
		// 	rotType = moveType.indexOf("Z");
		// }

		// if (rotType!=1) {
		// 	if (backwards) {
		// 		this[moveType.charAt(rotType)+"rotations"]+=3;
		// 	} else {
		// 		this[moveType.charAt(rotType)+"rotations"]+=1;
		// 	}
		// 	this[moveType.charAt(rotType)+"rotations"]%=4;
		// 	return;
		// }

		for (var i=0; i<3; i++) {
			for (var j=0; j<3; j++) {
				for (var k=0; k<3; k++) {
					var block = this.blocks[i][j][k];
					if (block!=undefined) {
						block[moveType.charAt(0)](backwards);
					}
				}
			}
		}
	}
}

function Move(type) {
	this.type=type;
	this.rotation=0;
	this.isFinished=false;

	if (type.indexOf("'")!=-1) {
		this.backwards=true;
	} else {
		this.backwards=false;
	}

	this.setSpeed = function(speed) {
		this.speed=speed;
		if (this.backwards) {
			this.speed*=-1;
		}
	}

	this.setSpeed(PI/10);

	switch (this.type) {
		case "F'":
		case "F":
			this.rotatedCenter=0;
			break;
		case "L'":
		case "L":
			this.rotatedCenter=1;
			break;
		case "B'":
		case "B":
			this.rotatedCenter=2;
			break;
		case "R'":
		case "R":
			this.rotatedCenter=3;
			break;
		case "U'":
		case "U":
			this.rotatedCenter=4;
			break;
		case "D'":
		case "D":
			this.rotatedCenter=5;
			break;
	}

	this.update = function () {
		if (moveSlider!=undefined) {
			this.setSpeed(moveSlider.value());
		}
		this.rotation+=this.speed;
		if (abs(this.rotation)>PI/2) {
			this.isFinished=true;
		}
	}
}

function Center(pos) {
	this.color = getCenterColor(pos);
	this.rotation = 0;

	this.isRelated = function (block) {
		switch (pos) {
			case 0:
				if (block.k==0) return true;
				return false;
			case 1:
				if (block.i==0) return true;
				return false;
			case 2:
				if (block.k==2) return true;
				return false;
			case 3:
				if (block.i==2) return true;
				return false;
			case 4:
				if (block.j==2) return true;
				return false;
			case 5:
				if (block.j==0) return true;
				return false;
		}
	}

	this.draw = function() {
		
		push();

		switch (pos) {
		case 0:
			break;
		case 1:
			rotateY(-PI/2);
			break;
		case 2:
			rotateY(PI);
			break;
		case 3:
			rotateY(PI/2);
			break;
		case 4:
			rotateX(PI/2);
			break;
		case 5:
			rotateX(-PI/2);
			break;
		}
		
		translate(0, 0, blockSize*3/2);
		
		rotateZ(this.rotation);
		
		drawBlockSide(this.color);

		pop();
	}
}

function Block(i, j, k) {
	this.i=i;
	this.j=j;
	this.k=k;

	this.origI = i;
	this.origJ = j;
	this.origK = k;

	this.axes = [createVector(0,0,1), createVector(-1,0,0), createVector(0,0,-1),
				createVector(1,0,0), createVector(0,-1,0), createVector(0,1,0)];
	
	this.colors = [];
	this.colorsCount=0;
	var positions = getCentersPos(i, j, k);
	
	for (var i=0; i<positions.length; i++) {
		var pos = positions[i];
		this.colors[pos] = getCenterColor(pos);
		this.colorsCount++;
	}

	this.draw = function(cenPos, rotation) {
		push();

		if (cenPos!=undefined) {
			rotate(rotation, this.axes[cenPos]);
		}
		
		translate((this.i-1)*blockSize, (this.j-1)*blockSize, -(this.k-1)*blockSize);

		for (var i=0; i<6; i++) {
			if (this.colors[i]==undefined) continue;
			
			push();

			switch (i) {
			case 0:
				break;
			case 1:
				rotateY(-PI/2);
				break;
			case 2:
				rotateY(PI);
				break;
			case 3:
				rotateY(PI/2);
				break;
			case 4:
				rotateX(PI/2);
				break;
			case 5:
				rotateX(-PI/2);
				break;
			}
			
			
			translate(0, 0, blockSize/2);

			drawBlockSide(this.colors[i]);

			pop();
		}
		pop();
	}

	this.F = function(backwards) {
		if (this.k==0) {
			if (backwards) {
				var times=3;
			} else {
				var times=1;
			}
			for (var t=0; t<times; t++) {
				var pos = getNextPos(this.i, this.j);
				this.i=pos.i;
				this.j=pos.j;
				this.Zrotate();
			}
		}
	}

	this.B = function(backwards) {
		if (this.k==2) {
			if (backwards) {
				var times=3;
			} else {
				var times=1;
			}
			for (var i=0; i<times; i++) {
				var pos = getNextPos(2-this.i, this.j);
				this.i=2-pos.i;
				this.j=pos.j;
				for (var j=0; j<3; j++) {
					this.Zrotate();
				}
			}
		}
	}

	this.L = function(backwards) {
		if (this.i==0) {
			if (backwards) {
				var times=3;
			} else {
				var times=1;
			}
			for (var i=0; i<times; i++) {
				var pos = getNextPos(2-this.k, this.j);
				this.k=2-pos.i;
				this.j=pos.j;
				this.Xrotate();
			}
		}
	}

	this.R = function(backwards) {
		if (this.i==2) {
			if (backwards) {
				var times=1;
			} else {
				var times=3;
			}
			for (var i=0; i<times; i++) {
				var pos = getNextPos(2-this.k, this.j);
				this.k=2-pos.i;
				this.j=pos.j;
				this.Xrotate();
			}
		}
	}

	this.D = function(backwards) {
		if (this.j==0) {
			if (backwards) {
				var times=3;
			} else {
				var times=1;
			}
			for (var i=0; i<times; i++) {
				var pos = getNextPos(this.i, 2-this.k);
				this.i=pos.i;
				this.k=2-pos.j;
				for (var j=0; j<3; j++) {
					this.Yrotate();
				}
			}
		}
	}

	this.U = function(backwards) {
		if (this.j==2) {
			if (backwards) {
				var times=3;
			} else {
				var times=1;
			}
			for (var i=0; i<times; i++) {
				var pos = getNextPos(this.i, this.k);
				this.i=pos.i;
				this.k=pos.j;
				this.Yrotate();
			}
		}
	}

	this.Xrotate = function () {
		var temp = this.colors[0];
		this.colors[0]=this.colors[4];
		this.colors[4]=this.colors[2];
		this.colors[2]=this.colors[5];
		this.colors[5]=temp;
	}

	this.Yrotate = function () {
		var temp = this.colors[0];
		this.colors[0]=this.colors[3];
		this.colors[3]=this.colors[2];
		this.colors[2]=this.colors[1];
		this.colors[1]=temp;
	}

	this.Zrotate = function () {
		var temp = this.colors[1];
		this.colors[1]=this.colors[5];
		this.colors[5]=this.colors[3];
		this.colors[3]=this.colors[4];
		this.colors[4]=temp;
	}

	function getNextPos (i, j) {
		return {
			"i": j,
			"j": (2-i)
		}
	}

}

function getCentersPos(i, j, k) {
	var positions = [];

	switch (k) {
		case 0:
			positions.push(0);
			break;
		case 2:
			positions.push(2);
			break;
	}
	switch (i) {
		case 0:
			positions.push(1);
			break;
		case 2:
			positions.push(3);
			break;
	}
	switch (j) {
		case 0:
			positions.push(5);
			break;
		case 2:
			positions.push(4);
			break;
	}
	return positions;
}

function getCenterAxis(pos) {
	switch (pos) {
		case 0:
		case 2:
			return 2;
		case 1:
		case 3:
			return 0;
		case 4:
		case 5:
			return 1;
	}
}

function getColors(i, j, k) {
	
	var colors = [];

	switch (i) {
		case 0:
		colors.push('yellow');
		break;
		case 2:
		colors.push('white');
		break;
	}
	switch (j) {
		case 0:
		colors.push('blue');
		break;
		case 2:
		colors.push('green');
		break;
	}
	switch (k) {
		case 0:
		colors.push('red');
		break;
		case 2:
		colors.push('orange');
		break;
	}



	return colors;
}

function getCenterColor(pos) {
	switch (pos) {
	case 0:
		return color('red');
	case 1:
		return color('yellow');
	case 2:
		return color('orange');
	case 3:
		return color('white');
	case 4:
		return color('green');
	case 5:
		return color('blue');
	}
}

// var d=true;

function drawBlockSide (sideColor) {
	
	
	
	push();
	fill(color('grey'));
	translate(0,0,-1);
	quad(-blockSize*0.5, -blockSize*0.5,
		-blockSize*0.5, blockSize*0.5,
		blockSize*0.5, blockSize*0.5,
		blockSize*0.5, -blockSize*0.5);
	pop();


	// if (d) {
	// 	console.log(sideColor.levels[2]);
	// 	d=false;
	// }

	// ambientMaterial(sideColor.levels[0], sideColor.levels[1], sideColor.levels[2]);
	//ambientMaterial(250);
	// sphere(5);

	fill(sideColor);
	quad(-sideSize*0.5, -sideSize*0.5,
		-sideSize*0.5, sideSize*0.5,
		sideSize*0.5, sideSize*0.5,
		sideSize*0.5, -sideSize*0.5);

	

};