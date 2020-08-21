import React, { Component } from 'react';
import api from './api';
import Scenario from './scenario';


class Veiculo extends Component{
  componentDidMount(){
    plotCar("map");
  }

  render(){
    return(
      <div id="map" className="mapa">
          <Scenario />
          <canvas id="cars"></canvas>
      </div>
    );
  } 
}

var plotCar = (id) => {
  var canvas = document.getElementById(id);
  var c = canvas.childNodes[0];

  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  console.log(c);
  console.log(`Width: ${width} e Height: ${height}`);
}

export default Veiculo;