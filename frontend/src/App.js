import React, { Component } from 'react';
import axios from 'axios'

let ip = "http://192.168.1.5/"
class App extends Component {
  toggleRed = () => {
    axios.get(ip + `toggle_red`)
      .then(response => {

      })
      .catch(err => {
        alert(err)
      })
  }
  toggleGreen = () => {
    axios.get(ip + `toggle_green`)
      .then(response => {

      })
      .catch(err => {
        alert(err)
      })
  }
  toggleBlue = () => {
    axios.get(ip + `toggle_blue`)
      .then(response => {

      })
      .catch(err => {
        alert(err)
      })
  }

  allOff = () => {
    axios.get(ip + `off`)
      .then(response => {

      })
      .catch(err => {
        alert(err)
      })
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.toggleRed}>Toggle Red</button><br/>
        <button onClick={this.toggleGreen}>Toggle Green</button><br/>
        <button onClick={this.toggleBlue}>Toggle Blue</button><br/>
        <button onClick={this.allOff}>All off</button><br/>
      </div>
    );
  }
}

export default App;
