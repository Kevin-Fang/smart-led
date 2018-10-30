var express = require('express')
var gpio = require('pigpio').Gpio
var app = express()

let leds = {
	red: new gpio(27, {mode: gpio.OUTPUT}),
	green: new gpio(17, {mode: gpio.OUTPUT}),
	blue: new gpio(22, {mode: gpio.OUTPUT})
}
console.log("Finished setting up LEDs")


app.use(require('cors')())

app.get("/toggle_red", (req, res) => {
	if (leds.red.digitalRead() == 0) {
		leds.red.pwmWrite(255)
		res.send("Turned on red LED")
	} else {
		leds.red.pwmWrite(0)
		res.send("Turned off red LED")
	}
})

app.get("/toggle_green", (req, res) => {
	if (leds.green.digitalRead() == 0) {
		leds.green.pwmWrite(255)
		res.send("Turned on green LED")
	} else {
		leds.green.pwmWrite(0)
		res.send("Turned off green LED")
	}
})

app.get("/toggle_blue", (req, res) => {
	if (leds.blue.digitalRead() == 0) {
		leds.blue.pwmWrite(255)
		res.send("Turned on blue LED")
	} else {
		leds.blue.pwmWrite(0)
		res.send("Turned off blue LED")
	}
})

app.listen(80)
console.log("Server listening on port 80")
