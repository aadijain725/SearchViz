
import "./App.css";
import * as React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import {Row, Col, Container } from "react-bootstrap";
import Bars from "./Components/Bars";

const userInput = [1,2,3,4,5,6,7,8,9];
// const colorArr = [
//   "rgba(255, 218, 128,0.4)",
//   "rgba(255, 218, 128,0.4)",
//   "rgba(255, 218, 128,0.4)",
//   "rgba(255, 218, 128,0.4)"
// ];

// "rgba(255, 134,159,0.4)",
// "rgba(98,  182, 239,0.4)",
// "rgba(113, 205, 205,0.4)"

function App() {
  return (
    <Container>
      {/* <Row>
        <Node></Node>
      </Row> */}
      <Row>
        <Bars barData= {userInput} color = "rgba(255, 218, 128,0.4)" target = {3}></Bars>
      </Row>
    </Container>
    
  );
}

export default App;
