import React from 'react';
import './App.css';
import Chart from "chart.js";

const url = "https://api.covid19api.com";
class App extends React.Component {
  chartRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      TotalConfirmed: '',
      NewlyConfirmed: '',
      TotalDeath: '',
      NewlyDeath: '',
      TotalRecovered: '',
      NewRecovered: '',
      Countries: [],
      selectedCountry: '',
      updatedTime: '',
      CountryName: '',
    }
  }
  componentDidMount() {
    this.getCountry();
    this.getSummary();
    this.getLastUpdatedTime();
  }
  getLastUpdatedTime = () => {
    let url = `https://api.covid19api.com/dayone/country/india/status/confirmed/live`;
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      // get data updated time and date 
      let a, b, d;
      let arrayLength = data.length - 1;
      a = data[arrayLength].Date;
      b = a.split('T');
      d = b[0].split('-');
      let dateFormated = d[1] + ":" + d[2] + ":" + d[0];
      let e = b[1].substring(0, b[1].length - 1);
      let time = e;
      this.setState({ updatedTime: dateFormated + "," + time });
    }).catch((errorLastUpdatedTime) => { console.log("errorLastUpdatedTime", errorLastUpdatedTime); });
  }
  generateGraphOnSelectedCountry = () => {
     if (this.state.selectedCountry !== '') {
       let space=this.state.selectedCountry;
      let comma= space.replace(/ /g,"-");
      let trimmedCountry= comma.replace(/,/g,'');
      let url = `https://api.covid19api.com/dayone/country/${trimmedCountry}/status/confirmed/live`;
      fetch(url).then((response) => {
        return response.json();
      }).then((dataGraph) => {
            this.getGraph(dataGraph);   
        
      }).catch((errorLiveDataCountryWise) => { console.log("errorLiveDataCountryWise", errorLiveDataCountryWise); });
     }

  }
  getGraph=(dataGraph)=>{
    let tempArrayDate = [];
    tempArrayDate = dataGraph.map((item) => {
      let a = item.Date
      let b = a.split('T');
      let d = b[0].split('-');
      let dateFormated = d[1] + "-" + d[2]; //+ ":" + d[0];
      return dateFormated;
    });
        //graph code
        const myChartRef = this.chartRef.current.getContext("2d");
        Chart.defaults.global.defaultFontFamily = ' "Lucida Grande", "Lucida Sans Unicode", "Arial", "Helvetica", "sans-serif" ';
        Chart.defaults.global.defaultFontSize = 10;
        Chart.defaults.global.defaultFontColor = '#777';
        new Chart(myChartRef, {
          type: "line",
          data: {
            //Bring in data
            labels: tempArrayDate.map((item) => { return item }),
            datasets: [
              {
                label: "Total Cases",
                data: dataGraph.map((item) => { return item.Cases }),
                fill: false,
                backgroundColor: '#40E0D0',
                borderColor: '#40E0D0',
              },
            ]
          },
          options: {
            //Customize chart options
            responsive: true, 
            title: {
              display: true,
              text: "Total Confirmed Cases in : " + (this.state.CountryName === '' ? 'All Country' : this.state.CountryName)
            },
            maintainAspectRatio: false,
             scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero:true
                  }
              }]
            }
          }
        });
  }
  getCountryOnChangeOfDropdown = (e) => {
    //setting selectedCountry value on select of drownbox
    this.setState({ selectedCountry: e.target.value });
    let countryName = '';
    let totalConfirmed = 0;
    let totalDeath = 0;
    let totalRecovered = 0;
    let newConfirmed = 0;
    let newDeaths = 0;
    let newRecovered = 0;
    fetch(url + '/summary').then((d) => {
      return d.json();
    }).then(data => {
      let tempFilteredArray = [];
      tempFilteredArray = data.Countries.filter((item) => {
        return item.Country === this.state.selectedCountry;
      });
      tempFilteredArray.map(item => {
        return (
          countryName = item.Country,
          totalConfirmed = item.TotalConfirmed,
          totalDeath = item.TotalDeaths,
          totalRecovered = item.TotalRecovered,
          newConfirmed = item.NewConfirmed,
          newDeaths = item.NewDeaths,
          newRecovered = item.NewRecovered
        )
      });
      this.setState({
        TotalConfirmed: totalConfirmed,
        NewlyConfirmed: newConfirmed,
        TotalDeath: totalDeath,
        NewlyDeath: newDeaths,
        TotalRecovered: totalRecovered,
        NewRecovered: newRecovered,
        CountryName: countryName
      });
      console.log(totalRecovered, totalConfirmed, totalDeath, newConfirmed, newDeaths, newRecovered, countryName, tempFilteredArray);
      this.generateGraphOnSelectedCountry();

      if (this.state.selectedCountry === "Select a Country") {
        this.getSummary();
      }
    }).catch(errorOnGetCountryOnchange => { console.log(errorOnGetCountryOnchange); });
  }
  getCountry = () => {
    let tempArray = [];
    fetch(url + '/countries').then(d => {
      return d.json();
    }).then(data => {
      tempArray = data.map((item, i) => {
        return [item.Country];
      })
      this.setState({ Countries: tempArray });
    }).catch(errorOnFetch => {
      console.log(errorOnFetch);
    });
  }
  getSummary = () => {
    let totalCon = 0;
    let newCon = 0;
    let totalDeth = 0;
    let newDeth = 0;
    let totalRec = 0;
    let newRec = 0;
    fetch(url + '/summary').then(d => {
      return d.json();
    }).then(data => {
      data.Countries.map((item, i) => {
        return (totalCon += item.TotalConfirmed,
          newCon += item.NewConfirmed,
          totalDeth += item.TotalDeaths,
          newDeth += item.NewDeaths,
          totalRec += item.TotalRecovered,
          newRec += item.NewRecovered
        );
      });
      this.setState({
        TotalConfirmed: totalCon,
        NewlyConfirmed: newCon,
        TotalDeath: totalDeth,
        NewlyDeath: newDeth,
        TotalRecovered: totalRec,
        NewRecovered: newRec
      });
    }).catch(errorOnSummary => {
      console.log("errorOnSummary :", errorOnSummary);
    });
  }
  render() {
    let me = this;
    const { Countries } = this.state;
    let countryList = Countries.length > 0 && Countries.map((item, i) => {
      return (
        <option key={i}> {item != "" ? item : "Select a Country"} </option>
      )
    }, this);
    return (
      <div>
        <h1 className="title">All Country Covid-19 Tracker</h1>
        <div className="subTitle">Last updated: {this.state.updatedTime}</div>
        <div className="container">
          <div className="div1">
            <div className="total-confirmed-div">Total Confirmed  <br /> <br /> <span className="data-confirmed"> {this.state.TotalConfirmed} </span> </div>
            <div className="newly-confirmed-div"> Newly Confirmed <br /> <br /> <span className="data-confirmed"> {this.state.NewlyConfirmed} </span></div>
          </div>
          <div className="div2">
            <div className="total-death-div"> Total Death <br /> <br /> <span className="data-death"> {this.state.TotalDeath} </span></div>
            <div className="newly-death-div"> Newly Death <br /> <br /> <span className="data-death"> {this.state.NewlyDeath} </span></div>
          </div>
          <div className="div3">
            <div className="total-recovered-div">Total Recovered <br /> <br /> <span className="data-recovered"> {this.state.TotalRecovered} </span></div>
            <div className="newly-recovered-div"> Newly Recovered <br /> <br /> <span className="data-recovered"> {this.state.NewRecovered} </span></div>
          </div>
          <div className="drop-down-box-div">
            <br />
            <br />
            <select id="country" onChange={(e) => me.getCountryOnChangeOfDropdown(e)}>
              {countryList}
            </select>
          </div>
          <br />
          <div 
           className="line-chart-totalConfirmed">
            <canvas 
              id="myChart"
              ref={this.chartRef}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default App;