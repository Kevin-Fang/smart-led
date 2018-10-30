import React, { Component } from 'react';
import axios from 'axios'
import Slider from '@material-ui/lab/Slider'

let ip = "http://192.168.1.7/"
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redValue: 0,
      greenValue: 0,
      blueValue: 0
    }
  }

  send_msg = async (msg) => {
    try {
      await axios.get(ip + msg)
    } catch (e) {
      alert(e)
    }
    return
  }
  toggleRed = async () => {
    await this.send_msg('toggle_red')
  }
  toggleGreen = async () => {
    await this.send_msg('toggle_green')
  }
  toggleBlue = async () => {
    await this.send_msg('toggle_blue')
  }
  allOff = async () => {
    await this.send_msg('off')
  }
  police = async () => {
    await this.send_msg('police')
  }
  fade1 = async () => {
    await this.send_msg('fade1')
  }
  fade2 = async () => {
    await this.send_msg('fade2')
  }

  random = async () => {
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)

    await this.send_msg(`set/red/${r}`)
    await this.send_msg(`set/green/${g}`)
    await this.send_msg(`set/blue/${b}`)

    this.setState({
      redValue: r,
      blueValue: b,
      greenValue: g
    })
  }

  handleChangeRed = async (event, value) => {
    value = Math.floor(value)
    this.setState({redValue: value}, async () => {
      await this.send_msg(`set/red/${this.state.redValue}`)
    })
  }
  handleChangeBlue = async (event, value) => {
    value = Math.floor(value)
    this.setState({blueValue: value}, async () => {
      await this.send_msg(`set/blue/${this.state.blueValue}`)
    })
  }
  handleChangeGreen = async (event, value) => {
    value = Math.floor(value)
    this.setState({greenValue: value}, async () => {
      await this.send_msg(`set/green/${this.state.greenValue}`)
    })
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.toggleRed}>Toggle Red</button><br/>
        <button onClick={this.toggleGreen}>Toggle Green</button><br/>
        <button onClick={this.toggleBlue}>Toggle Blue</button><br/>
        <button onClick={this.random}>Random</button><br/>
        <button onClick={this.police}>Police</button><br/>
        <button onClick={this.fade1}>Fade 1</button><br/>
        <button onClick={this.fade2}>Fade 2</button><br/>
        <button onClick={this.allOff}>All off</button><br/><br/>
        <Slider
          value={this.state.redValue}
          onChange={this.handleChangeRed}
          max={255}
          color={"red"}
          min={0}
          sliderStyle={{handleFillColor: 'red'}}
          style={{width: 300, padding: 20, handleFillColor: 'red'}}
          aria-labelledby="Red"
        /><br/><br/>
        <Slider
          value={this.state.greenValue}
          onChange={this.handleChangeGreen}
          max={255}
          min={0}
          style={{width: 300, padding: 20}}
          aria-labelledby="Green"
        /><br/><br/>
        <Slider
          value={this.state.blueValue}
          max={255}
          min={0}
          onChange={this.handleChangeBlue}
          style={{width: 300, padding: 20}}
          aria-labelledby="Blue"
        />
      </div>
    );
  }
}

export default App;
