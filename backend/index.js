var express = require('express')
var http = require('http')
var socketio = require('socket.io')

var app = express()
var server = http.Server(app)
var io = socketio(server)

let port = 8000

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
	console.log(`Listening on port ${port}`)
})


io.on('connection', (socket) => {
	console.log("Client joined on", socket)
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
})

let writeColor = (led, value) => {
	if (!testing) {
		leds[led].pwmWrite(value)
	} else {
		console.log(`Writing ${value} to ${led}`)
	}
	current[led] = value
	io.emit('colors', current)
}
