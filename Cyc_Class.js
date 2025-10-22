
export class LED {
  constructor(color_on, color_off, radius, x, y, index, p) {
    this.color_on = color_on;
    this.color_off = color_off;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.index = index;
    this.p = p; //p5js instance
    this.lit = 0;
  }

  on() {
    this.lit = 1;
  }
  
  off() {
    this.lit = 0;
  }
  
  toggle() {
    if(this.lit == 0) {
      this.lit = 1;
    } else {
      this.lit = 0;
    }
  }

  drawLED() {
    if(this.lit) {
      this.p.fill(this.color_on);
    } else {
      this.p.fill(this.color_off);
    }

    this.p.ellipse(this.x, this.y, this.radius*2.0, this.radius*2.0);
  }
  
}

export class LEDRing {

  constructor(color_on, color_off, number, LED_radius, arc_separation, centerX, centerY, p) {
      
      this.color_on = color_on;
      this.color_off = color_off;
      this.number = number;
      this.LED_radius = LED_radius;
      this.arc_separation = arc_separation;
      
      this.centerX = centerX;
      this.centerY = centerY;

      //p5js instance
      this.p = p;

      this.angle_spacing = 360.0/this.number;
      this.angle_radians = this.angle_spacing * (Math.PI/180.0);
      this.ring_radius = (this.arc_separation + 2*this.LED_radius)/(this.angle_radians);

      this.direction = "CW"; //alternative is "CCW"

      this.seed_Array = [];
      this.LED_Array = []; 
      
      this.min_distance = 8;
      this.cw_dist = 0;
      this.ccw_dist = 0;
  
      this.activeIndex = 0; //the index of the LED currently lit during the play of the game
      this.seedIndex = 0;
  }

  generateSeed() {
    let randomIndex = 0;
    let chosenValue = 0;
    let previousValue = 0;
    let currentLength = 0;
    let distance = 0;
    let temp_array = [];
    //fill with 0-47
    for(var i = 0; i < this.number; i++) {
      temp_array.push(i);
    }
    
    while(temp_array.length > 0) {
      randomIndex = Math.floor(temp_array.length*Math.random());
      currentLength = this.seed_Array.length;
      previousValue = this.seed_Array[currentLength - 1];
      chosenValue = temp_array[randomIndex];
      distance = Math.abs(chosenValue - previousValue);
      if(distance < this.min_distance) { //select a new random value if distance is "unfair"
        continue;
      }

      this.seed_Array.push(chosenValue);
      temp_array.splice(randomIndex, 1); //praying
    }
    
    //console.log(this.seed_Array);  
  }

  initiateSeed() {
    //at the start, initiate to the first position
    this.LED_Array[this.seedIndex].on();
    this.seedIndex = this.seedIndex + 1;
  }

  nextInSeed() {
    this.LED_Array[this.activeIndex].off();
    if(this.seedIndex == this.number) { //this condition actually implies the user has one, I believe
      return;
    } 
    
    let nextIndex = this.seed_Array[this.seedIndex];
    this.LED_Array[nextIndex].on(); 
    this.activeIndex = nextIndex;
    this.seedIndex = this.seedIndex + 1;

    //console.log(this.activeIndex);

    //testing to see if it hits all the correct positions
    //console.log(this.seedIndex); //gets up to 48
  }

  shift() {
    this.LED_Array[this.activeIndex].off();
    let nextIndex = 0;
    if(this.direction == "CW") {
      if(this.activeIndex == 0) {
        nextIndex = this.number - 1; //roll over from index 0 to index N-1
      } else {
        nextIndex = this.activeIndex - 1;
      }
    } else if(this.direction == "CCW") {
      if(this.activeIndex == (this.number - 1)) {
        nextIndex == 0; //roll over from N-1 back to 0 (I hope)
      } else {
        nextIndex = this.activeIndex + 1; 
      }
    } else {
      console.log("something went wrong -- direction variable not CW or CCW");
    }

    this.activeIndex = nextIndex;
    this.LED_Array[this.activeIndex].on(); 
    
    console.log(this.activeIndex);
  }

  shortestPath(targetIndex) {
    let currentIndex = this.activeIndex;
    let CW_Distance = 0;
    let CCW_Distance = 0; //increasing index, based on how LEDs are generated with increasing angle from x-axis "0 degrees"
    let highestIndex = this.number - 1;

    //actually an important note! due to the setup of the coordinates, everything is actually flipped -- what i thought was
    //CW is actually CCW and vice versa, because origin is at top left of screen
    //however as of me typing this, the shortest path logic works well, so treading lightly
    //flipped all the labels on the distance variables below and praying...
    //had to do this for shift logic above as well

    if(targetIndex > currentIndex) {
      CW_Distance = Math.abs(currentIndex + (highestIndex-targetIndex)); //roll over from 0, back to 47 -- could be shorter
      CCW_Distance = Math.abs(targetIndex - currentIndex);
    }
    
    if(targetIndex < currentIndex) {
      CW_Distance = Math.abs(targetIndex - currentIndex);
      CCW_Distance = Math.abs(targetIndex + (highestIndex-currentIndex)); //roll over from 0, back to 47 -- could be shorter
    }

    //console.log(CW_Distance);
    //console.log(CCW_Distance);

    this.cw_dist = CW_Distance;
    this.ccw_dist = CCW_Distance;

  }

  changeDirectionShortest() {
    if(this.cw_dist < this.ccw_dist) {
      this.direction = "CW";
    } else {
      this.direction = "CCW";
    }
    console.log("new direction = " + this.direction);
  }

  generateLEDs() {
    var currentAngle = 0;
    var currentRadians = 0;
    var current_xoff = 0; //x offset from center of canvas
    var current_yoff = 0; //y offset from center of canvas
    var current_x = 0; //center of LED for object being created 
    var current_y = 0;

    for(var i = 0; i < this.number; i++) {
      currentAngle = this.angle_spacing*i; //starting at zero
      //console.log(currentAngle);
      
      currentRadians = (Math.PI/180.0)*currentAngle;
      //console.log(currentRadians);
    
      current_xoff = this.ring_radius * Math.cos(currentRadians);
      current_yoff = this.ring_radius * Math.sin(currentRadians);

      //console.log(this.angle_spacing);
      //console.log(this.ring_radius);

      //console.log(this.LED_radius);
      //console.log(this.arc_separation);

      //console.log(current_xoff);
      //console.log(current_yoff);

      current_x = this.centerX + current_xoff;
      current_y = this.centerY + current_yoff;

      let temp_LED = new LED(this.color_on, this.color_off, this.LED_radius, current_x, current_y, i, this.p);
      this.LED_Array.push(temp_LED);
    }

    //console.log(this.LED_Array);
  }

  blinkAll() {
    for(var i = 0; i < this.number; i++) {
      this.LED_Array[i].toggle();
    }
  }
  
  drawLEDs() {
    for(var i = 0; i < this.number; i++) {
      this.LED_Array[i].drawLED();
    }
  }

  getActiveIndex() {
    return this.activeIndex;
  }
  
  getDirection() {
    return this.direction;
  }
}
