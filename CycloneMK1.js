import { LEDRing } from './Cyc_Class.js';

//canvas spec
var canvasWidth = 800;
var canvasHeight = 800;
var centerWidth = canvasWidth/2;
var centerHeight = canvasHeight/2;

//p5 ticker
var drawCounts = 0;
var seconds = 0; // assuming 60 fps, drawCounts/60 

//ideas for constants! although maybe tweaked based on difficulty

var LEDS_PER_RING = 48;
var BLINK_FREQ = 2; //blinks/sec
var BLINK_FREQ_DRAWS = BLINK_FREQ/60.0;

var BLINK_PERIOD_DRAWS = parseInt(1/BLINK_FREQ_DRAWS);

//note -- should be a property of an LED Ring that can be set from this file based upon difficulty
//selector at the time of pushing the start button

var LEDS_PER_SEC = 2 //in LEDs/sec
var LEDS_PER_DRAW = LEDS_PER_SEC/60.0;
var DRAWS_PER_MOVE = parseInt(1/LEDS_PER_DRAW);


//drawing parameter constants

var LED_RAD = 10;
//WHEEL_RAD = 10

//SEG_W
//SEG_H

var START_X = canvasWidth/2.0;
var START_Y = canvasWidth*(3.0/4.0);
var START_W = '120px';
var START_H = '40px';
var START_BCKD_COLOR = '#c25904';

//arrays

//PATTERN_SEED = []
//USER_RING = []
//GAME_RING = []

//success_counter = 0 //number of successful hits

//constructor(color, number, LED_radius, arc_separation, centerX, centerY) {

var USER_RING;
var GAME_RING;

//intended callback function for when spacebar is pressed
window.keyPressed = function() {
  if (key === ' ') {
    console.log('Spacebar was pressed');
    // This won't pause draw(), but if it takes long, it could cause lag
  }
}

window.setup = function() {
  let RED_ON = color(255, 0, 0);
  let RED_OFF = color(150, 0, 0);
  
  let GREEN_ON = color(0, 255, 0);
  let GREEN_OFF = color(0, 150, 0);
	
  createCanvas(canvasWidth, canvasHeight);
	background(150, 220, 255);
  
  /*
  let start_button = createButton('START');
  
  // Position the button
  start_button.position(START_X, START_Y);
  
  // Set the width and height of the button
  start_button.style('width', START_W);
  start_button.style('height', START_H);
  
  // Set background color, border style, and font size
  start_button.style('background-color', START_BCKD_COLOR); // Yellow background
  start_button.style('border', '2px solid #000'); // Black border
  start_button.style('font-size', '24px');
  
  // Set text color and padding
  start_button.style('color', '#ffffff'); // White text
  start_button.style('padding', '10px');
  
  // Set margin and cursor style
  start_button.style('margin', '10px');
  start_button.style('cursor', 'pointer');
  */
  //constructor(color, number, LED_radius, arc_separation, centerX, centerY) {
  //console.log(LED_RAD);
  GAME_RING = new LEDRing(RED_ON, RED_OFF, LEDS_PER_RING, LED_RAD, 10, centerWidth, centerHeight);
  USER_RING = new LEDRing(GREEN_ON, GREEN_OFF, LEDS_PER_RING, LED_RAD, 5, centerWidth, centerHeight);
 
  GAME_RING.generateLEDs();
  USER_RING.generateLEDs();
 
  //comment so this thing updates? 
  GAME_RING.generateSeed();
  GAME_RING.initiateSeed();
}

window.draw = function() {
	//clear canvas
	background(150, 220, 255);
  GAME_RING.drawLEDs();
  USER_RING.drawLEDs();

  if(drawCounts % parseInt(BLINK_PERIOD_DRAWS/2) == 0) {
    //console.log("toggle all");  
    //GAME_RING.blinkAll();
    //GAME_RING.nextInSeed();
    USER_RING.shift();

    if(GAME_RING.getActiveIndex() == USER_RING.getActiveIndex()) {
      console.log("aligned, next");
      GAME_RING.nextInSeed();
      USER_RING.shortestPath(GAME_RING.getActiveIndex());
      USER_RING.changeDirectionShortest();
    }
    //USER_RING.blinkAll();
  }
    
	drawCounts++;
  seconds=drawCounts/60;

}
