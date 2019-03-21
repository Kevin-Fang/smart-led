var express = require('express')
var http = require('http')
var socketio = require('socket.io')
var ip = require("ip");

var app = express()
var server = http.Server(app)
var io = socketio(server)

let port = 8000

let pattern;

let testing = true;

if (!testing) {
	var gpio = require('pigpio').Gpio
	let leds = {
		red: new gpio(27, {mode: gpio.OUTPUT}),
		green: new gpio(17, {mode: gpio.OUTPUT}),
		blue: new gpio(22, {mode: gpio.OUTPUT})
	}
}

let current = {
	red: 0,
	green: 0,
	blue: 0
}

server.listen(port, () => {
	console.log(`Listening on ${ip.address()}:${port}`)
})

allOff = () => {
	writeColor('red', 0)
	writeColor('green', 0)
	writeColor('blue', 0)
	clearInterval(pattern)
}

let writeColor = (led, value) => {
	if (!testing) {
		leds[led].pwmWrite(value)
	} else {
		console.log(`Writing ${value} to ${led}`)
	}
	current[led] = value
	if (!pattern) {
		io.emit('colors', current)
	}	
}

io.on('connection', (socket) => {
	socket.emit('colors', current)

	socket.on('setcolor', (colors) => {
		console.log("Setting color: ", JSON.stringify(colors))
		if (colors.red != undefined) {
			writeColor('red', colors.red)
		}
		if (colors.green != undefined) {
			writeColor('green', colors.green)
		}
		if (colors.blue != undefined) {
			writeColor('blue', colors.blue)
		}
	})

	socket.on('police', () => {
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
			
		console.log("Police")
	})

	socket.on('fade', () => {
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
				if (inc_led == "red") {
					inc_led = "green"
					dec_led = "red"
				} else if (inc_led == "green") {
					inc_led = "blue"
					dec_led = "green"
				} else if (inc_led == "blue") {
					inc_led = "red"
					dec_led = "blue"
				}
			}
		}, 30)
	})

	socket.on('off', () => {
		console.log("Turning everything off")
		allOff()
	})
})
