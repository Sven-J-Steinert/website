function launchAni() {

  /* This code was in its core created by GPT-3 javascript-sandbox with the following command */

  /* objects that attract each other by gravity */

  /* further modifications have been build up on that */

  var G = 1;
  var force_max = 100;
  var objects = [];
  var canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var cent_w = window.innerWidth / 2;
  var cent_h = window.innerHeight / 2;

  var obj_color = getComputedStyle(canvas).backgroundColor === 'rgb(0, 0, 0)' ? 'black' : 'white';

  function Object(x, y, vx, vy, mass) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.shouldMerge = false;
  }

  function addObject(x, y, vx, vy, mass) {
    objects.push(new Object(x, y, vx, vy, mass));
  }

  function mergeObjects(obj1, obj2) {
    // Combine masses and momenta to create a new entity
    var totalMass = obj1.mass + obj2.mass;
    var mergedVx = (obj1.mass * obj1.vx + obj2.mass * obj2.vx) / totalMass;
    var mergedVy = (obj1.mass * obj1.vy + obj2.mass * obj2.vy) / totalMass;
  
    // Calculate the weighted average position based on masses
    var mergedX = (obj1.x * obj1.mass + obj2.x * obj2.mass) / totalMass;
    var mergedY = (obj1.y * obj1.mass + obj2.y * obj2.mass) / totalMass;
  
    // Create the new merged object
    return new Object(mergedX, mergedY, mergedVx, mergedVy, totalMass);
  }
  

  function checkCollisions() {
    for (var i = 0; i < objects.length; i++) {
      var obj1 = objects[i];
      for (var j = i + 1; j < objects.length; j++) {
        var obj2 = objects[j];
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = Math.sqrt(obj1.mass) + Math.sqrt(obj2.mass);
  
        if (dist < minDist && !obj1.shouldMerge && !obj2.shouldMerge) {
          obj1.shouldMerge = true;
          obj2.shouldMerge = true;
          obj1.collisionPartner = obj2; // Store the partner object for merging
          obj2.collisionPartner = obj1; // Store the partner object for merging
        }
      }
    }
  }

  function update() {
    checkCollisions();

    // Merge collided objects
    for (var i = objects.length - 1; i >= 0; i--) {
      var obj = objects[i];
      if (obj.shouldMerge) {
        var mergedObj = mergeObjects(obj, obj.collisionPartner);
        objects.splice(i, 1); // Remove the first object from the array
        objects.splice(objects.indexOf(obj.collisionPartner), 1); // Remove the second object from the array
        objects.push(mergedObj); // Add the merged object to the array
      }
    }

    // Update velocities and positions for non-merged objects
    for (var i = 0; i < objects.length; i++) {
      var obj1 = objects[i];
      for (var j = i + 1; j < objects.length; j++) {
        var obj2 = objects[j];
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var force = G * obj1.mass * obj2.mass / (dist * dist);
        if (force > force_max) { force = 4; }
        var ax = force * dx / dist;
        var ay = force * dy / dist;
        obj1.vx -= ax / obj1.mass;
        obj1.vy -= ay / obj1.mass;
        obj2.vx += ax / obj2.mass;
        obj2.vy += ay / obj2.mass;
      }
    }

    // Update positions for non-merged objects
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      obj.x += obj.vx;
      obj.y += obj.vy;
      }

    
  }





function draw() {
  // Draw objects
  ctx.fillStyle = obj_color;
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

  // Function to generate a random number within a range
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Function to generate a random object
  function generateRandomObject(min_mass,max_mass) {
    var x = randomInRange(0, canvas.width);
    var y = randomInRange(0, canvas.height);
    var vx = randomInRange(-1, 1);
    var vy = randomInRange(-1, 1);
    var mass = randomInRange(min_mass, max_mass);
    addObject(x, y, vx, vy, m_factor*mass);
  }

  // Determine PixelAera for scaling
  var A = canvas.width * canvas.height;
  if (A < 600000) {A = 600000;} // minimum scale
  var A_ref = 3345920; // 4k design reference 2560*1307
  var m_factor = A / A_ref;

  // Generate dust
  var numRandomObjects = 2000;
  for (var i = 0; i < numRandomObjects; i++) {
    generateRandomObject(0.1,0.5);
  }

  // Generate medium
  //var numRandomObjects = 0; 
  //for (var i = 0; i < numRandomObjects; i++) {
  //  generateRandomObject(5,10);
  //}

  // Generate protosun
  //addObject(cent_w , cent_h, 0, 0, m_factor*10);

  loop();

}