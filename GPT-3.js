/* This code was in its core created by GPT-3 javascript-sandbox with the following command */

/* objects that attract each other by gravity */
var G = 1;
var force_max = 10;
var objects = [];
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');
var center = window.innerWidth / 2;

function Object(x, y, vx, vy, mass) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.mass = mass;
}

function addObject(x, y, vx, vy, mass) {
  objects.push(new Object(x, y, vx, vy, mass));
}

function update() {
  for (var i = 0; i < objects.length; i++) {
    var obj1 = objects[i];
    for (var j = i + 1; j < objects.length; j++) {
      var obj2 = objects[j];
      var dx = obj1.x - obj2.x;
      var dy = obj1.y - obj2.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var force = G * obj1.mass * obj2.mass / (dist * dist);
      if (force > force_max ) { force = 4;}
      var ax = force * dx / dist;
      var ay = force * dy / dist;
      obj1.vx -= ax / obj1.mass;
      obj1.vy -= ay / obj1.mass;
      obj2.vx += ax / obj2.mass;
      obj2.vy += ay / obj2.mass;
    }
  }
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    obj.x += obj.vx;
    obj.y += obj.vy;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, Math.sqrt(obj.mass), 0, 2 * Math.PI);
    ctx.fill();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}


addObject(center , 500, 0, 0, 1000);
addObject(center + 480, 600, 0, -1, 50);

addObject(center + 350, 450, 0, -2,5);
addObject(center + 360, 450, 0, -1.2,5);

addObject(center -100, 400, -2, 2, 30);
addObject(center, 400, -3, 0, 10);

addObject(center -320, 500, 0, 1.5,15);
addObject(center -330, 500, 0, 2.8,2);

loop();