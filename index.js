var express = require('express')
var gpio = require('pigpio').Gpio
var app = express()

let leds = {
	red: new gpio(27, {mode: gpio.OUTPUT}),
	green: new gpio(17, {mode: gpio.OUTPUT}),
	blue: new gpio(22, {mode: gpio.OUTPUT})
}

let current = {
	red: 0,
	green: 0,
	blue: 0
}

function writeColor(led, value) {
	leds[led].pwmWrite(value)
	current[led] = value
}

let pattern

console.log("Finished setting up LEDs")


app.use(require('cors')())

app.get("/toggle_red", (req, res) => {
	if (leds.red.digitalRead() == 0) {
		writeColor('red', 255)
		res.send("Turned on red LED")
	} else {
		writeColor('red', 0)
		res.send("Turned off red LED")
	}
})

app.get("/toggle_green", (req, res) => {
	if (leds.green.digitalRead() == 0) {
		writeColor('green', 255)
		res.send("Turned on green LED")
	} else {
		writeColor('green', 0)
		res.send("Turned off green LED")
	}
})

app.get("/toggle_blue", (req, res) => {
	if (leds.blue.digitalRead() == 0) {
		writeColor('blue', 255)
		res.send("Turned on blue LED")
	} else {
		writeColor('blue', 0)
		res.send("Turned off blue LED")
	}
})

app.get("/set/:color/:value", (req, res) => {
	if (req.params.color === "red") {
		writeColor('red', req.params.value)
	} else if (req.params.color === "green") {
		writeColor('green', req.params.value)
	} else if (req.params.color === "blue") {
		writeColor('blue', req.params.value)
	} else {
		res.send(`No such color: ${req.params.color}`)
		return
	}
	res.send(`Set ${req.params.color} to ${req.params.value}`)
})

app.get('/police', (req, res) => {
	allOff()
	let red = true
	pattern = setInterval(() => {
		if (red) {
			writeColor('red', 0)
			writeColor('blue', 150)
			red = false
		} else {
			writeColor('blue', 0)
			writeColor('red', 150)
			red = true
		}}, 75)
	res.send("Turned on police")
})

app.get('/fade1', (req, res) => {
	allOff()
	let led = "red"
	let dutyCycle = 0
	decreasing = false

	pattern = setInterval(() => {
		writeColor(led, dutyCycle)
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
				led = "green"
			} else if (led == leds.green) {
				led = "blue"
			} else if (led == leds.blue) {
				led = "red"
			}
		}
	}, 30)
	res.send("Turned on fade1")
	
})

app.get('/fade2', (req, res) => {
	allOff()
	let inc_led = "red"
	let dec_led = null
	let dutyCycle = 0

	pattern = setInterval(() => {
		dutyCycle = dutyCycle % 255
		writeColor(inc_led, dutyCycle)
		if (dec_led != null) {
			writeColor(dec_led, 255 - dutyCycle)
		}
		dutyCycle += 3

		if (dutyCycle >= 255) {
			if (inc_led == leds.red) {
				inc_led = "green"
				dec_led = "red"
			} else if (inc_led == leds.green) {
				inc_led = "blue"
				dec_led = "green"
			} else if (inc_led == leds.blue) {
				inc_led = "red"
				dec_led = "blue"
			}
		}
	}, 30)
	res.send("Turned on fade2")
	
})

allOff = () => {
	leds.red.pwmWrite(0)
	leds.green.pwmWrite(0)
	leds.blue.pwmWrite(0)
	clearInterval(pattern)
	
}

app.get("/off", (req, res) => {
	allOff()
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
