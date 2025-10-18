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

//LED_RATE = 2 //in LEDs/sec

//drawing parameter constants

var LED_RAD = 10;
//WHEEL_RAD = 10

//SEG_W
//SEG_H

//BUTTON_W
//BUTTON_H

//arrays

//PATTERN_SEED = []
//USER_RING = []
//GAME_RING = []

//success_counter = 0 //number of successful hits

//constructor(color, number, LED_radius, arc_separation, centerX, centerY) {

var USER_RING;
var GAME_RING;

window.setup = function() {
  let RED_ON = color(255, 0, 0);
  let RED_OFF = color(150, 0, 0);
  
  let GREEN_ON = color(0, 255, 0);
  let GREEN_OFF = color(0, 150, 0);
	
  createCanvas(canvasWidth, canvasHeight);
	background(150, 220, 255);
  
  //constructor(color, number, LED_radius, arc_separation, centerX, centerY) {
  //console.log(LED_RAD);
  GAME_RING = new LEDRing(RED_ON, RED_OFF, LEDS_PER_RING, LED_RAD, 10, centerWidth, centerHeight);
  USER_RING = new LEDRing(GREEN_ON, GREEN_OFF, LEDS_PER_RING, LED_RAD, 5, centerWidth, centerHeight);
 
  GAME_RING.generateLEDs();
  USER_RING.generateLEDs();
}

window.draw = function() {
	//clear canvas
	background(150, 220, 255);
  GAME_RING.drawLEDs();
  USER_RING.drawLEDs();

  if(drawCounts % parseInt(BLINK_PERIOD_DRAWS/2) == 0) {
    console.log("toggle all");  
    GAME_RING.blinkAll();
    USER_RING.blinkAll();
  }
    
	drawCounts++;
  seconds=drawCounts/60;

}
