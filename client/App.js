import React, { Component } from "react";
import moment from "moment";
import "./App.css";
import LineChart from "./LineChart";
import ToolTip from "./ToolTip";
import InfoBox from "./InfoBox";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null,
      inputvalue: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    });
  }
  componentDidMount() {
    // const getData = () => {
    //   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${
    //     this.state.inputvalue
    //   }&outputsize=30&apikey=IWT42GSCZX7Z2SDI`;
    //   fetch(url)
    //     .then(r => r.json())
    //     .then(stockData => {
    //       const sortedData = [];
    //       let count = 0;
    //       let keys = Object.keys(stockData["Time Series (Daily)"]).sort();
    //       for (let i = 0; i < keys.length; i++) {
    //         sortedData.push({
    //           d: moment(keys[i]).format("MMM DD"),
    //           p: Number(
    //             stockData["Time Series (Daily)"][keys[i]]["4. close"]
    //           ).toLocaleString("us-EN", {
    //             style: "currency",
    //             currency: "USD"
    //           }),
    //           x: count,
    //           y: Number(stockData["Time Series (Daily)"][keys[i]]["4. close"])
    //         });
    //         count++;
    //       }
    //       this.setState({
    //         data: sortedData,
    //         fetchingData: false
    //       });
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // };
    // getData();
    // this.refresh = setInterval(() => getData(), 10000);
  }

  handleChange(event) {
    this.setState({
      inputvalue: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const getData = () => {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${
        this.state.inputvalue
      }&outputsize=30&apikey=IWT42GSCZX7Z2SDI`;
      fetch(url)
        .then(r => {
          console.log(r);
          return r.json();
        })
        .then(stockData => {
          const sortedData = [];
          let count = 0;
          let keys = Object.keys(stockData["Time Series (Daily)"]).sort();
          for (let i = 0; i < keys.length; i++) {
            sortedData.push({
              d: moment(keys[i]).format("MMM DD"),
              p: Number(
                stockData["Time Series (Daily)"][keys[i]]["4. close"]
              ).toLocaleString("us-EN", {
                style: "currency",
                currency: "USD"
              }),
              x: count,
              y: Number(stockData["Time Series (Daily)"][keys[i]]["4. close"])
            });
            count++;
          }
          this.setState({
            data: sortedData,
            fetchingData: false
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    getData();
  }
  render() {
    return (
      <div className="container">
        <div className="stockCode">
          <form onSubmit={this.handleSubmit}>
            <label>Stock Code</label>
            <input
              type="text"
              value={this.state.inputvalue}
              onChange={this.handleChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="row">
          <h1>30 Day Stock Price Chart </h1>
        </div>
        <div className="row">
          {!this.state.fetchingData ? (
            <InfoBox
              data={this.state.data}
              inputValue={this.state.inputvalue}
            />
          ) : null}
        </div>
        <div className="row">
          <div className="popup">
            {this.state.hoverLoc ? (
              <ToolTip
                hoverLoc={this.state.hoverLoc}
                activePoint={this.state.activePoint}
              />
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="chart">
            {!this.state.fetchingData ? (
              <LineChart
                data={this.state.data}
                onChartHover={(a, b) => this.handleChartHover(a, b)}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
