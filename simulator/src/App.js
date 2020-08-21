import React, { Component } from 'react';
import Veiculo from './simulador/veiculo';
import { Container, Row, Col } from 'react-bootstrap';
import Maps from './simulador/Maps';

class App extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm={4}>
            <Maps />
          </Col>
          <Col> 
            <Veiculo />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
