import React, { Component } from 'react';
import Mapa from "../img/mapa.png";

class Scenario extends Component{
    state = {
      baseUrl : 'street' 
    }
  
    render(){
      return(
        <img id="Map" src={Mapa} />
      );
    }
}


export default Scenario;