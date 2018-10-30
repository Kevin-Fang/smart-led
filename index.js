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
	clearInterval(pattern)
	let red = true
	pattern = setInterval(() => {
		if (red) {
			leds.red.pwmWrite(0)
			leds.blue.pwmWrite(150)
			red = false
		} else {
			leds.blue.pwmWrite(0)
			leds.red.pwmWrite(150)
			red = true
		}}, 75)
})

app.get('/fade1', (req, res) => {
	clearInterval(pattern)
	let led = leds.red
	let dutyCycle = 0
	decreasing = false

	pattern = setInterval(() => {
		led.pwmWrite(dutyCycle)
		if (decreasing) {
			dutyCycle -= 5
		} else{
			dutyCycle += 5
		}

		if (dutyCycle == 255) {
			decreasing = true
		} else if (dutyCycle == 0) {
			decreasing = false
			if (led == leds.red) {
				led = leds.green
			} else if (led == leds.green) {
				led = leds.blue
			} else if (led == leds.blue) {
				led = leds.green
			}
		}
	}, 30)
	res.send("Turned on fade1")
	
})

app.get('/fade2', (req, res) => {
	clearInterval(pattern)
	let inc_led = leds.red
	let dec_led = null
	let dutyCycle = 0

	pattern = setInterval(() => {
		dutyCycle = dutyCycle % 255
		inc_led.pwmWrite(dutyCycle)
		if (dec_led != null) {
			dec_led.pwmWrite(255 - dutyCycle)
		}
		dutyCycle += 3

		if (dutyCycle >= 255) {
			if (inc_led == leds.red) {
				inc_led = leds.green
				dec_led = leds.red
			} else if (inc_led == leds.green) {
				inc_led = leds.blue
				dec_led = leds.green
			} else if (inc_led == leds.blue) {
				inc_led = leds.red
				dec_led = leds.blue
			}
		}
	}, 30)
	res.send("Turned on fade2")
	
})


app.get("/off", (req, res) => {
	leds.red.pwmWrite(0)
	leds.green.pwmWrite(0)
	leds.blue.pwmWrite(0)
	clearInterval(pattern)
	res.send("Turned all LEDs off")
})

app.get("/seizure", (req, res) => {
	clearInterval(pattern)
	pattern = setInterval(() => {
		[leds.red, leds.green, leds.blue].map((led) => {
			led.pwmWrite(Math.floor(Math.random() * 255))
		}, 100)
	})
})

app.listen(80)
console.log("Server listening on port 80")
