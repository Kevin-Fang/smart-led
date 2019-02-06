import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import SocketIOClient from 'socket.io-client'

let ip = "http://localhost:8000"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.socket = SocketIOClient(`${ip}`)

    this.socket.on('colors', (colors) => {
      this.setState({
        red: colors.red,
        blue: colors.blue,
        green: colors.green
      })
    })

    this.state = {
      red: 0,
      blue: 0,
      green: 0
    }
  }


  toggleRed = () => {
    console.log("Toggling red")
    if (this.state.red > 0) {
      this.socket.emit('setcolor', {red: 0})
    } else {
      this.socket.emit('setcolor', {red: 255})
    }
  }

  toggleBlue = () => {
    console.log("Toggling blue")
    if (this.state.blue > 0) {
      this.socket.emit('setcolor', {blue: 0})
    } else {
      this.socket.emit('setcolor', {blue: 255})
    }
  }

  toggleGreen = () => {
    console.log("Toggling green")
    if (this.state.green > 0) {
      this.socket.emit('setcolor', {green: 0})
    } else {
      this.socket.emit('setcolor', {green: 255})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.toggleRed}
          title="Toggle Red" />
        <Button onPress={this.toggleGreen}
          title="Toggle Green" />
        <Button onPress={this.toggleBlue}
          title="Toggle Blue" />
        <View>
          <Text>Red: {this.state.red}</Text>
          <Text>Green: {this.state.green}</Text>
          <Text>Blue: {this.state.blue}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);