var Gpio = require('pigpio').Gpio

var red = new Gpio(27, {mode: Gpio.OUTPUT})
var green = new Gpio(17, {mode: Gpio.OUTPUT})
var blue = new Gpio(22, {mode: Gpio.OUTPUT})

let dutyCycle = 0
let decreasing = false
let led = red

setInterval(() => {
	led.pwmWrite(dutyCycle)
	if (dutyCycle == 0) {
		decreasing = false
		if (led == red) {
			led = green
		} else if (led == green) {
			led = blue
		} else if (led == blue) {
			led = red
		}
	} else if (dutyCycle == 255) {
		decreasing = true
	}

	if (decreasing) {
		dutyCycle -= 5
	} else {
		dutyCycle += 5
	}
}, 30)
