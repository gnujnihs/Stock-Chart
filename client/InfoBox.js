import React, { Component } from "react";
import moment from "moment";
import "./InfoBox.css";

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    };
  }
  componentDidMount() {
    this.getData = () => {
      // console.log(this.props);
      const data = this.props.data;
      // console.log(this.props);
      // console.log(data);
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${
        this.props.inputValue
      }&interval=1min&apikey=IWT42GSCZX7Z2SDI`;

      fetch(url)
        .then(r => r.json())
        .then(stockData => {
          let keys = Object.keys(stockData["Time Series (1min)"]);
          const price = Number(
            stockData["Time Series (1min)"][keys[0]]["4. close"]
          );
          const change = Number(price - data[data.length - 22].y);
          const changeP =
            ((price - data[data.length - 22].y) / data[data.length - 22].y) *
            100;

          this.setState({
            currentPrice: price,
            monthChangeD: change.toLocaleString("us-EN", {
              style: "currency",
              currency: "USD"
            }),
            monthChangeP: changeP.toFixed(2) + "%",
            updatedAt: stockData["Meta Data"]["3. Last Refreshed"]
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    this.getData();
    this.refresh = setInterval(() => this.getData(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.refresh);
  }
  render() {
    return (
      <div id="data-container">
        {this.state.currentPrice ? (
          <div id="left" className="box">
            <div className="heading">
              {this.state.currentPrice.toLocaleString("us-EN", {
                style: "currency",
                currency: "USD"
              })}
            </div>
            <div className="subtext">
              {"Updated " +
                moment(this.state.updatedAt)
                  .subtract(3, "hour")
                  .fromNow()}
            </div>
          </div>
        ) : null}
        {this.state.currentPrice ? (
          <div id="middle" className="box">
            <div className="heading">{this.state.monthChangeD}</div>
            <div className="subtext">Change Since Last Month (USD)</div>
          </div>
        ) : null}
        <div id="right" className="box">
          <div className="heading">{this.state.monthChangeP}</div>
          <div className="subtext">Change Since Last Month (%)</div>
        </div>
      </div>
    );
  }
}

export default InfoBox;
