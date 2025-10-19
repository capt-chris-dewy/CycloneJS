
export class LED {
  constructor(color_on, color_off, radius, x, y, index) {
    this.color_on = color_on;
    this.color_off = color_off;
    this.radius = radius;
    this.x = x;
    this.y = y;

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
      fill(this.color_on);
    } else {
      fill(this.color_off);
    }

    ellipse(this.x, this.y, this.radius*2.0, this.radius*2.0);
  }
  
}

export class LEDRing {

  constructor(color_on, color_off, number, LED_radius, arc_separation, centerX, centerY) {
      
      this.color_on = color_on;
      this.color_off = color_off;
      this.number = number;
      this.LED_radius = LED_radius;
      this.arc_separation = arc_separation;
      
      this.centerX = centerX;
      this.centerY = centerY;

      this.angle_spacing = 360.0/this.number;
      this.angle_radians = this.angle_spacing * (Math.PI/180.0);
      this.ring_radius = (this.arc_separation + 2*this.LED_radius)/(this.angle_radians);

      this.direction = "CW"; //alternative is "CCW"

      this.seed_Array = [];
      this.LED_Array = []; 
      
      this.min_distance = 8;
    
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
    
    console.log(this.seed_Array);  
  }

  nextInSeed() {
    //at the start, initiate to the first position
    if(this.seedIndex == 0) {
      this.LED_Array[this.seedIndex].on();
      this.seedIndex = this.seedIndex + 1;
    }

    this.LED_Array[this.activeIndex].off();
    if(this.seedIndex == this.number) { //this condition actually implies the user has one, I believe
      return;
    } 
    
    let nextIndex = this.seed_Array[this.seedIndex];
    this.LED_Array[nextIndex].on(); 
    this.activeIndex = nextIndex;
    this.seedIndex = this.seedIndex + 1;

    //testing to see if it hits all the correct positions
    //console.log(this.seedIndex); //gets up to 48
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

      let temp_LED = new LED(this.color_on, this.color_off, this.LED_radius, current_x, current_y, i);
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
}
