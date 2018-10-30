var Gpio = require('pigpio').Gpio

var red = new Gpio(27, {mode: Gpio.OUTPUT})
var green = new Gpio(17, {mode: Gpio.OUTPUT})
var blue = new Gpio(22, {mode: Gpio.OUTPUT})

red.pwmWrite(0)
green.pwmWrite(0)
blue.pwmWrite(255)
