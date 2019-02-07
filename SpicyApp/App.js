import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SocketIOClient from 'socket.io-client'

import { Slider, Button, ButtonGroup, Badge } from 'react-native-elements';


let ip = "http://192.168.1.5:8000"

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.socket = SocketIOClient(`${ip}`)

    this.socket.on('colors', (colors) => {
      if (!this.state.changing) {
        this.setState({
          red: colors.red,
          blue: colors.blue,
          green: colors.green,
          changing: false
        })
      }
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

  allOff = () => {
    this.socket.emit('setcolor', {green: 0, red: 0, blue: 0})
  }

  updateByState = () => {
    this.socket.emit('setcolor', this.state)
  }

  slidingStart = () => {
    this.setState({
      changing: true
    })
  }

  slidingStop = () => {
    this.setState({
      changing: false
    })
  }

  changeRed = (e) => {
    this.setState({
      red: Math.floor(e * 255)
    }, () => {
      this.updateByState()
    })
  }

  changeGreen = (e) => {
    this.setState({
      green: Math.floor(e * 255)
    }, () => {
      this.updateByState()
    })
  }

  changeBlue = (e) => {
    this.setState({
      blue: Math.floor(e * 255)
    }, () => {
      this.updateByState()
    })
  }

  toggleIndex = (index) => {
    if (index === 0) {
      this.toggleRed()
    } else if (index === 1) {
      this.toggleGreen()
    } else {
      this.toggleBlue()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.toggleIndex}
          buttons={['Toggle Red', 'Toggle Green', 'Toggle Blue']}
          containerStyle={{height: 100}}
        />
        <Button style={{margin: 10}} 
          type="clear"
          titleStyle={{ color: 'red' }}
          onPress={this.allOff}
          title="All off" />
        <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
          <Badge value={this.state.red} status="error" />
          <Badge value={this.state.green} status="success" />
          <Badge value={this.state.blue} status="primary" />
        </View>
        <View style={{alignItems: 'stretch', margin: 20, justifyContent: 'center'}}>
          <Slider 
            animateTransitions={true} 
            onSlidingStart={this.slidingStart}
            onSlidingComplete={this.slidingStop}
            onValueChange={this.changeRed} 
            value={this.state.red / 255} 
            thumbTintColor="red" />
          <Slider 
            animateTransitions={true} 
            onValueChange={this.changeGreen} 
            onSlidingStart={this.slidingStart}
            onSlidingComplete={this.slidingStop}
            value={this.state.green / 255} 
            thumbTintColor="green" />
          <Slider 
            animateTransitions={true} 
            onValueChange={this.changeBlue} 
            onSlidingStart={this.slidingStart}
            onSlidingComplete={this.slidingStop}
            value={this.state.blue / 255} 
            thumbTintColor="blue" />
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
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);