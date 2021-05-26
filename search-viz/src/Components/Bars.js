import Button from 'react-bootstrap/Button';
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import useEffect from 'react';

const FILTERED_COLOR = "rgba(0,0,0,0.4)";

class Bars extends React.Component {

  constructor(props) {
    super(props);
    let colors = [];
    let copyColors = [];
    for (let i = 0; i <  this.props.barData.length; i++) {
      // console.log("initial color: ", this.props.color);
      colors.push(this.props.color);
      copyColors.push(this.props.color);
    }

    let start = 0
    let end = this.props.barData.length - 1;
    let mid = Math.floor((start + end)/2);
    const initialState = {
      barData: {
        labels: this.props.barData,
        datasets: [
          {
            label: 'Values',
            data: this.props.barData,
            backgroundColor: copyColors,
          }
        ],
        borderWidth: 100
      }, 
      colorsArray: copyColors,
      changeColors: true,
      points: [this.props.barData[start], this.props.barData[mid], this.props.barData[end]],
      indices: [start, mid, end],
      markEnd : false
    }
    this.state = {
      barData: {
        labels: this.props.barData,
        datasets: [
          {
            label: 'Values',
            data: this.props.barData,
            backgroundColor: colors,
          }
        ],
        borderWidth: 100
      }, 
      colorsArray: colors,
      changeColors: true,
      points: [this.props.barData[start], this.props.barData[mid], this.props.barData[end]],
      indices: [start, mid, end],
      markEnd : false,
      initialState: initialState
    };
    
    this.startAnimation  = this.startAnimation.bind(this); // bind to the component
    this.stopAnimation = this.stopAnimation.bind(this);
    this.reset = this.reset.bind(this);
  }

  // Animates the targets the specified colors
  animateColors(color, targets) {
    // console.log("changing colors");
    // TODO: Need to change color of tragets depending on color and index
    // console.log("targets:", targets);
    let colors = this.state.colorsArray;
    let colorsArray = [];
    for(let i =  0; i < colors.length; i++) {
      colorsArray.push(colors[i]);
    }

    for (let i = 0; i < targets.length; i++) {
      colors[targets[i]] = color;
    }
    // console.log("colors array in animateColors", colors);
    // console.log("colorsArray in animateColors", colorsArray);



    let labels = this.state.barData.labels;
    let data = this.state.barData.datasets[0].data;

    // console.log("labels: ", labels);
    // console.log("data: ", data);

    let start = this.state.indices[0];
    let mid = this.state.indices[1];
    let end = this.state.indices[2];

    this.setState({
        barData: {
          labels: labels,
          datasets: [
            {
              label: 'Values',
              data: data,
              backgroundColor: colors,
            }
          ],
          borderWidth: 100
      }, 
      colorsArray: colorsArray,
      changeColors: false,
      points: [this.props.barData[start], this.props.barData[mid], this.props.barData[end]],
      indices: [start, mid, end],
    });
  }

  markFiltered(newStart, newEnd) {
    // console.log("changing data");

    let data = this.state.barData.datasets[0].data;
    let newData = [];
    let colors = [];
    let labels = [];
    
    // Update colors according to what is filtered
    for (let i = 0; i < data.length; i++) {
      if (i <= newEnd && i >= newStart) {
        colors.push(this.state.colorsArray[i]);
      } else {
        colors.push(FILTERED_COLOR);
      }
      labels.push(this.state.barData.labels[i]);
    }

    // console.log("colors corr to new data is:", colors);


    let start = newStart;
    let end = newEnd;
    let mid = Math.floor((start+end)/2);

    // console.log("newEnd in markFiltered: ", end);
    this.setState({
      barData: {
        labels: labels,
        datasets: [
          {
            label: 'Values',
            data: data,
            backgroundColor: colors,
          }
        ],
        borderWidth: 100
      },
      colorsArray: colors,
      changeColors: true,
      points: [newData[start], newData[mid], newData[end]],
      indices: [start, mid, end],
    });

  }

  markEnd(color, idx) {
    let length = this.props.barData.length;
    let colors = [];
    for(let i =  0; i < length; i++) {
      colors.push(FILTERED_COLOR);
    }
    colors[idx] = color;

    let labels = this.state.barData.labels;
    let data = this.state.barData.datasets[0].data;

    this.setState({
        barData: {
          labels: labels,
          datasets: [
            {
              label: 'Values',
              data: data,
              backgroundColor: colors,
            }
          ],
          borderWidth: 100
      }, 
      colorsArray: colors,
      changeColors: false,
      markEnd: true,
    });
  }


  BinarySearch(arr, x, changeColors) {
    let start=this.state.indices[0], end=this.state.indices[2];    
    // Find the mid index
    let mid=Math.floor((start + end)/2);
    console.log("mid is: ", mid);
    console.log("start", start);
    console.log("end", end);

    console.log("Initial state: ", this.state.initialState);


    if (changeColors) {
      // console.log("changeColors inside if", changeColors);
      this.animateColors("rgba(113, 205, 205,0.4)", [start, mid, end]);
      // TODO: replace above with 1 exact data being shown
    } else {
        // If element is present at mid, return True
      if (arr[mid]===x) {
        console.log("Reached Target");
        this.markEnd("rgba(255,0,0, 0.4)", [mid])
      }
      // Else look in left or right half accordingly
      else if (arr[mid] < x) {
            console.log("arr[mid] < 1 with mid = ", mid);
            start = mid + 1;
            console.log("start is: ", start);
            this.markFiltered(start, end);
      }
      else {
            end = mid - 1;
            this.markFiltered(start, end);
      }
    }
  }
  // STARTS animating, ie. stepping through the binary search code
  startAnimation() {
      console.log("interval is null: ", this.interval == null);
      if(!this.interval) { // If animation isn't already running
        this.interval = setInterval(() => {
          console.log("initialState ", this.state.initialState);
          if (this.state.markEnd) {
            this.stopAnimation();
          } else {
            this.BinarySearch(this.state.barData.datasets[0].data, this.props.target, this.state.changeColors)
          }
        }, 1000);
    }
  }

  // STOPS animating, ie. stepping through the binary search code
  stopAnimation() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    if (this.interval) { // animation is running
      this.stopAnimation();
    }
    let colors = [];
    for (let i = 0; i <  this.props.barData.length; i++) {
      // console.log("initial color: ", this.props.color);
      colors.push(this.props.color);
    }

    let start = 0
    let end = this.props.barData.length - 1;
    let mid = Math.floor((start + end)/2);
    const initialState = {
      barData: {
        labels: this.props.barData,
        datasets: [
          {
            label: 'Values',
            data: this.props.barData,
            backgroundColor: colors,
          }
        ],
        borderWidth: 100
      }, 
      colorsArray: colors,
      changeColors: true,
      points: [this.props.barData[start], this.props.barData[mid], this.props.barData[end]],
      indices: [start, mid, end],
      markEnd : false
    }
    this.setState(initialState);
    // window.location.reload(false);
  }

  // TODO: Possibly change visual elements
  // Color needs to get consistently rendered
  // Add step by step code state 
  render() {
    return (
      <Container>
        <Row>
          <Col>
          <h3 className="mt-5">Bar chart</h3>
          <h5 className="mt-5"> Target Element: {this.props.target}</h5>
          {!this.state.changeColors && <Row>
          <h5> Low = {this.state.points[0]}, Mid = {this.state.points[1]}, High = {this.state.points[2]} </h5>
        </Row>}
          {this.state.changeColors && <Row>
            <h5> Current set of numbers being searched </h5>
            </Row>}
          <Bar
          data = {this.state.barData}
          options = {{
            xAxes: [{
                gridLines: { 
                    display:false
                }
            }],
            yAxes: [{
                gridLines: {
                    display:false
            }}] 
          }}
          />
          </Col>
        </Row>
        <Row>
          <Button variant="primary" onClick = {this.startAnimation}>
            Play Animation 
          </Button >
          <Button variant="danger" onClick = {this.stopAnimation}>
            Pause Animation
          </Button>
          <Button  variant="warning" onClick = {()=> {this.BinarySearch(this.state.barData.datasets[0].data, this.props.target, this.state.changeColors)}}>
            Next in Binary Search
          </Button>
          <Button variant="info" onClick = {this.reset}>
            Reset Algorithm
          </Button>

        </Row>
      </Container>
    );
  }
}

export default Bars;




  // barRef = React.createRef();
  // componentDidMount() {
  //   const optionsList = {
  //     scales: {
  //       borderColor: 'black',
  //       borderWidth: 100, 
  //       xAxes: [{
  //           gridLines: {
  //               display:false
  //           }
  //       }],
  //       yAxes: [{
  //           gridLines: {
  //               display:false
  //       }}] 
  //     }
  //   };

  //   const myBarRef = this.barRef.current.getContext("2d");
        
  //       new Chart(myBarRef, {
  //           type: "bar",
  //           data: {
  //               //Bring in data
  //               labels: ['1','2','3','4'],
  //               datasets: [
  //                 {
  //                   label: 'Values',
  //                   data: this.props.barData,
  //                   backgroundColor: this.props.colors[2],
  //                 }
  //               ],
  //           },
  //           options: {optionsList}
  //       });
  // }
  
   // responsive : true,
            // title: {
            //   display: true, 
            //   text: 'Array\'s current state',
            //   fontSize:  25
            // },
            // Legend:{
            //   display: false,
            //   position: 'right'
            // },


  // state = {
  //   dataBar: {
  //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //     datasets: [
  //       {
  //         label: "% of Votes",
  //         data: [12, 19, 3, 5, 2, 3],
  //         backgroundColor: [
  //           "rgba(255, 134,159,0.4)",
  //           "rgba(98,  182, 239,0.4)",
  //           "rgba(255, 218, 128,0.4)",
  //           "rgba(113, 205, 205,0.4)",
  //           "rgba(170, 128, 252,0.4)",
  //           "rgba(255, 177, 101,0.4)"
  //         ],
  //         borderWidth: 2,
  //         borderColor: [
  //           "rgba(255, 134, 159, 1)",
  //           "rgba(98,  182, 239, 1)",
  //           "rgba(255, 218, 128, 1)",
  //           "rgba(113, 205, 205, 1)",
  //           "rgba(170, 128, 252, 1)",
  //           "rgba(255, 177, 101, 1)"
  //         ]
  //       }
  //     ]
  //   },
  //   barChartOptions: {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     scales: {
  //       xAxes: [
  //         {
  //           barPercentage: 1,
  //           gridLines: {
  //             display: true,
  //             color: "rgba(0, 0, 0, 0.1)"
  //           }
  //         }
  //       ],
  //       yAxes: [
  //         {
  //           gridLines: {
  //             display: true,
  //             color: "rgba(0, 0, 0, 0.1)"
  //           },
  //           ticks: {
  //             beginAtZero: true
  //           }
  //         }
  //       ]
  //     }
  //   }
  // }