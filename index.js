var express = require('express')
var gpio = require('pigpio').Gpio
var app = express()

let leds = {
	red: new gpio(27, {mode: gpio.OUTPUT}),
	green: new gpio(17, {mode: gpio.OUTPUT}),
	blue: new gpio(22, {mode: gpio.OUTPUT})
}

let pattern

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

app.get("/set/:color/:value", (req, res) => {
	if (req.params.color === "red") {
		leds.red.pwmWrite(req.params.value)
	} else if (req.params.color === "green") {
		leds.green.pwmWrite(req.params.value)
	} else if (req.params.color === "blue") {
		leds.blue.pwmWrite(req.params.value)
	} else {
		res.send(`No such color: ${req.params.color}`)
		return
	}
	res.send(`Set ${req.params.color} to ${req.params.value}`)
})

app.get('/police', (req, res) => {
	pattern = setInterval(() => {
		if (leds.red.digitalRead() == 1) {
			leds.red.pwmWrite(0)
			leds.blue.pwmWrite(150)
		} else {
			leds.blue.pwmWrite(0)
			leds.red.pwmWrite(150)
		}}, 250)
})

app.get("/off", (req, res) => {
	leds.red.pwmWrite(0)
	leds.green.pwmWrite(0)
	leds.blue.pwmWrite(0)
	clearInterval(pattern)
	res.send("Turned all LEDs off")
})

app.listen(80)
console.log("Server listening on port 80")
