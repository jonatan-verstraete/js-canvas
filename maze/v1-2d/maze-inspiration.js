let dptx = 50
let dpty = -50
const wt = 10


function line3d(x1, y1, x2, y2, px=0, py=0) {
  const grd1 = ctx.createLinearGradient(posInt(x1), posInt(y1+dpty), posInt(x2+dptx), posInt(y2));
  grd1.addColorStop(0, "gray");
  grd1.addColorStop(1, "black");

  if(x1 > x2) px = 1
  else if(x1 < x2) px = -1
  if(y1 < y2) py = 1
  else if(y1 > y2) py = -1
  
  const wx = wt * py
  const wy = wt * px

  ctx.lineWidth = wt
  ctx.strokeStyle = 'black'
  ctx.fillStyle = grd1

  function drawMiddle() {
    const mx = wx/2
    const my = wy/2
    ctx.beginPath();
    ctx.moveTo(x2+dptx-mx, y2+dpty+my)
    ctx.lineTo(x1+dptx-mx, y1+dpty+my)
    ctx.lineTo(x1-mx, y1+my)
    ctx.lineTo(x2-mx, y2+my)
    ctx.lineTo(x2+dptx-mx, y2+dpty+my)
    ctx.stroke()
  }

  function drawRight() {
    ctx.beginPath();
    ctx.moveTo(x2+dptx, y2+dpty)
    ctx.lineTo(x1+dptx, y1+dpty)
    //ctx.stroke()
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x2+dptx, y2+dpty)
    ctx.fill()
  }

  function drawLeft() {
    ctx.beginPath();
    ctx.moveTo(x2+dptx+wx, y2+dpty+wy)
    ctx.lineTo(x1+dptx+wx, y1+dpty+wy)
    //ctx.stroke()
    ctx.lineTo(x1+wx, y1+wy)
    ctx.lineTo(x2+wx, y2+wy)
    ctx.lineTo(x2+dptx+wx, y2+dpty+wy)
    ctx.fill()
  }
  drawRight()

//   if(dptx < 0) {
//     drawLeft()
//     drawMiddle()
//     drawRight()
//   } else {
//     drawRight()
//     drawMiddle()
//     drawLeft()
//   }
}


//line3d(300, 300, 400, 300)

/*
 * 
 * 
 * Maze generator using Prim's algorithm
 *  cody smith   2011     m0ose at yahoo dot com
 *  
 *  thanks to ed angel for the description
 * 
 *
 * 
 */

let __VISITED = 0;
let __UNVISITED = 1;



this.cell = function(x,y, maze) {
	this.x = x;
	this.y = y;
	this.up = true;
	this.down = true;
	this.left = true;
	this.right = true;
	this.maze = maze
	
	this.state = __UNVISITED;
	
	this.getNeighbors = function() {
		let result = {up: this.maze.whatsAt( x, y-1),
				down: this.maze.whatsAt( x,y+1),
				left: this.maze.whatsAt( x-1, y),
				right: this.maze.whatsAt( x+1, y)};
		return result;
	}
}
this.mazer = function( width, height) {
	this.width = width;
	this.height = height;
	this.maze = new Array( width);
	this.totalCells = 0;
	this.visited = [];
	
	// init grid
	for( let i = 0 ; i < width ; i++)
		{
		this.maze[i] = new Array(height);
		for( let j=0; j < height; j++)
			{
				let newCell = new cell(i,j, this);
				this.maze[i][j] = newCell;
				//this.unvisited.push( newCell);
				this.totalCells ++; 
			}
		}
	
	this.whatsAt =  function(x,y) {
		if( x < 0 || x >= this.width || y < 0 || y >= this.height){
				return null;
		}
		return this.maze[x][y];
	}
	
	this.makeAMaze = function() {	
		//get the first cell. a random one.	
		let current = this.maze[ Math.floor( Math.random() * this.width)][ Math.floor( Math.random() * this.height)];//this.unvisited.splice( currIndex, 1)[0];//remove from unvisited stack
		current.state = __VISITED;
		this.visited.push( current);
		
		while( this.visited.length < this.totalCells)
			{
			//get a random visited cell
			currIndex = Math.floor( Math.random() * this.visited.length);
			current = this.visited[ currIndex];
			
			//check if it can move     //
			//
			//  first . get a random direction
			let canMove = true;
			while ( canMove) {
				//shuffle directions
				let directions = ['left', 'right', 'up', 'down' ];
				directions.sort( randomSort);
				let neighbors = current.getNeighbors();
				//  next check those directions    //
				canMove = false;
				while( directions.length > 0 && canMove == false)
					{
					let dir = directions.pop();
					if( neighbors[dir] && neighbors[dir].state ==__UNVISITED )
						{
						//move there
						canMove = true;
						let past = current;
						current = neighbors[ dir];
						if( dir == 'up'){ 
							past.up = false;
							current.down=false;
						}
						if( dir == 'down'){ 
							past.down = false;
							current.up=false;
						}
						if( dir == 'left'){ 
							past.left = false;
							current.right=false;
						}
						if( dir == 'right'){ 
							past.right = false;
							current.left=false;
						}
						current.state = __VISITED;
						this.visited.push( current);
						}
					}
				}
		
			
		//   move current to random neighboring unvisited cell
		//   remove walls between those cells
		//
			}
		//this.draw();
	}
	
	
	//
	// BELOW IS DRAWING FUNCTIONS
	//
	this.draw = function( canvas, personX, personY) {
		let xRatio = cnv.width / this.width;
		let yRatio = cnv.height / this.height;
	

		for( let x=0; x<this.width; x++){
			for( let y=0; y<this.height; y++){
				let aCell = this.whatsAt(x,y);
				if( aCell){
					if( aCell.state == __VISITED){
							//ctx.fillRect( x*xRatio, y*yRatio, xRatio, yRatio);
							if(aCell.up){
                line3d(x*xRatio, y*yRatio, (x+1)*xRatio, y*yRatio, 0, -1)
								// ctx.moveTo( x*xRatio, y*yRatio);
								// ctx.lineTo( (x+1)*xRatio, y*yRatio);
							}
							if(aCell.down) {
                line3d(x*xRatio, (y+1)*yRatio, (x+1)*xRatio, (y+1)*yRatio, 0, 1)
								// ctx.moveTo( x*xRatio, (y+1)*yRatio);
								// ctx.lineTo( (x+1)*xRatio, (y+1)*yRatio);
							}
							if(aCell.right) {
                line3d((x+1)*xRatio, y*yRatio, (x+1)*xRatio, (y+1)*yRatio, 1, 0)
								// ctx.moveTo( (x+1)*xRatio, y*yRatio);
								// ctx.lineTo( (x+1)*xRatio, (y+1)*yRatio);
							}
							if(aCell.left) {
                line3d(x*xRatio, y*yRatio, x*xRatio, (y+1)*yRatio, -1, 0)
								// ctx.moveTo( x*xRatio, y*yRatio);
								// ctx.lineTo( x*xRatio, (y+1)*yRatio);
							}
							
						}
					}
				}	
			}

		ctx.beginPath()
		if( personX && personY) {
			ctx.strokeStyle = 'rgb(255,255,255)';
			ctx.fillStyle = 'rgb(200, 0, 0)';
			
			ctx.moveTo( (personX) * xRatio , (personY) * yRatio);
			ctx.arc( ( personX)* xRatio, ( personY)*yRatio , 4 , 0 , Math.PI * 2, true);
			
			ctx.fill();

			}
		ctx.closePath();
		ctx.stroke();
	}
	
	
	this.make2dVertexArray = function() {
		//this goes through the cells and makes a 2d vertex array for the walls
		//   it will be helpfull for web gl
		if( this.totalCells <= 0){
			return null;}
		let vertices = [];
		for( let y=0; y< this.height; y++)
			{
			for( let x=0; x < this.width; x++)
				{
					let aCell = this.whatsAt(x,y);
					if( aCell)
					{
						if( aCell.down == true)
							vertices.push({p1:{x:x, y:y+1}, p2:{x:x+1,y:y+1}} );
						if( aCell.right == true)
							vertices.push({p1:{x:x+1, y:y}, p2:{x:x+1,y:y+1}} );
						if( y == 0)
							vertices.push({p1:{x:x, y:0}, p2:{x:x+1,y:0}} );
						if( x == 0)
							vertices.push({p1:{x:0, y:y}, p2:{x:0,y:y+1}} );
					}
				}
			}
		return vertices;
	}
	
	this.drawVertices = function( canvas) {
		ctx.fillStyle = 'rgb(0, 200, 0)';
		let xRatio = cnv.width / this.width;
		let yRatio = cnv.height / this.height;
		
		ctx.lineWidth=3;
		ctx.strokeStyle = 'rgb(200,0,50)';
		ctx.beginPath();
		let vertices = this.make2dVertexArray();
		for( let v=0; v < vertices.length; v++ )
			{
			let vert = vertices[v];
			ctx.moveTo(vert.p1.x * xRatio, vert.p1.y * yRatio);
			ctx.lineTo(vert.p2.x * xRatio, vert.p2.y * yRatio);
			}
		ctx.closePath();
		ctx.stroke();
	}
	
}

function randomSort(a,b) { 
	//there must be a better shuffling technique
	//return Math.floor((Math.random()*3)-1) ;
		return Math.floor( Math.random() * 4) - 1; 
} 


function main() {
  let daMaze;
  daMaze = new mazer(20, 20);
  //test 1,2
  daMaze.maze[0][1].getNeighbors()
  //test 3 just draw it.
  daMaze.makeAMaze();
  daMaze.draw();
  
  //test4
  daMaze.make2dVertexArray().length
  daMaze.drawVertices();
  
  
  async function animate() {
    clear()
    daMaze.draw();
    await pauseHalt()
    requestAnimationFrame(animate)
  }
  animate()
  
  const inc = 5
  window.onkeydown = (e)=> {
    if(pause) return
    const ev = e.key
    if(ev === 'ArrowUp') {
      dpty -= inc
    } else if(ev === 'ArrowDown') {
      dpty += inc
    } else if(ev === 'ArrowLeft') {
      dptx -= inc
    } else if(ev === 'ArrowRight') {
      dptx += inc
    }
  }
}

main()