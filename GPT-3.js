function launchAni() {
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

  canvas.style.backgroundColor = 'black';
  var obj_color = 'white';

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
      var mass1Sqrt = Math.sqrt(obj1.mass);

      for (var j = i + 1; j < objects.length; j++) {
        var obj2 = objects[j];
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = mass1Sqrt + Math.sqrt(obj2.mass);

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
        if (force > force_max) {
          force = 4;
        }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i];
      var treshhold =  0.02* (TotalMass * m_factor);
  
      if (obj.mass > treshhold) {
        
  
        // Calculate the luminosity factor (you can use obj.mass as a proxy for luminosity)
        var luminosityFactor = (obj.mass - treshhold) / (TotalMass * m_factor * 0.5);
  
        // Calculate the color based on the Hertzsprung-Russell diagram
        var color = getColorFromHRDiagram(luminosityFactor);
  
        // Set the fill style to the calculated color
        //ctx.fillStyle = color;

        // Determine the glow radius based on mass
        var glowRadius = Math.sqrt(obj.mass)*1.1;

        // Draw the glowing circle
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, glowRadius, 0, 2 * Math.PI);
        ctx.shadowBlur = 5* glowRadius; // Adjust the glow effect intensity
        ctx.shadowColor = color; // Glow color
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadowBlur for non-glowing objects

        // draw white base circle
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, Math.sqrt(obj.mass), 0, 2 * Math.PI);
        ctx.fillStyle = obj_color;
        ctx.fill();


      } else {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, Math.sqrt(obj.mass), 0, 2 * Math.PI);
        ctx.fillStyle = obj_color;
        ctx.fill();
      }
    }
  }
  
  // Function to get color based on the Hertzsprung-Russell diagram with dark red, orange, white, and blue gradient
  function getColorFromHRDiagram(luminosityFactor) {
    let r, g, b;

    if (luminosityFactor <= 0.25) {
        // Red giants
        r = 255;
        g = b = luminosityFactor * 4 * 255;
    } else if (luminosityFactor <= 0.5) {
        // Main sequence stars (like our Sun)
        r = 255;
        g = 255;
        b = (luminosityFactor - 0.25) * 4 * 255;
    } else if (luminosityFactor <= 0.75) {
        // White dwarfs
        r = g = b = 255 - (luminosityFactor - 0.5) * 4 * 255;
    } else {
        // Blue giants
        r = g = (1 - luminosityFactor) * 4 * 255;
        b = 255;
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

  
    
  var lastTime = 0;
  var frameRate = 1000 / 60; // 60 FPS
  function loop(timestamp) {
    var deltaTime = timestamp - lastTime;
    if (deltaTime >= frameRate) {
      lastTime = timestamp;
      update();
      draw();
    }
    requestAnimationFrame(loop);
  }

  // Function to generate a random number within a range
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  var TotalMass = 0;

  // Function to generate a random object
  function generateRandomObject(min_mass, max_mass) {
    var x = randomInRange(0, canvas.width);
    var y = randomInRange(0, canvas.height);
    var vx = randomInRange(-1, 1);
    var vy = randomInRange(-1, 1);
    var mass = randomInRange(min_mass, max_mass);
    TotalMass = TotalMass + mass;
    addObject(x, y, vx, vy, m_factor * mass);
  }

  // Determine PixelAera for scaling
  var A = canvas.width * canvas.height;
  if (A < 600000) {
    A = 600000;
  } // minimum scale
  var A_ref = 3345920; // 4k design reference 2560*1307
  var m_factor = A / A_ref;

  // Generate dust
  var numRandomObjects = 1000;
  for (var i = 0; i < numRandomObjects; i++) {
    generateRandomObject(0.5, 0.8);
  }

  requestAnimationFrame(loop);
}
