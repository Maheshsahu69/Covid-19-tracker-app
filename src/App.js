import React from 'react';
import './App.css';

const url="https://api.covid19api.com";
class App extends React.Component{
constructor(props){
super(props);
this.state={
  TotalConfirmed:'',
  NewlyConfirmed:'',
  TotalDeath:'',
  NewlyDeath:'',
  TotalRecovered:'',
  NewRecovered:'',
   Countries:[],
   selectedCountry:''
}

this.getCountry=this.getCountry.bind(this);
this.getSummary=this.getSummary.bind(this);
this.getCountryOnChangeOfDropdown=this.getCountryOnChangeOfDropdown.bind(this);
}

componentDidMount(){
  this.getCountry();
 this.getSummary();
}
getCountryOnChangeOfDropdown(){

  if(this.state.selectedCountry===""){
    this.getSummary();
  }
  else{
  let countryName='';
  let totalConfirmed=0;
  let totalDeath=0;
  let totalRecovered=0;
  let newConfirmed=0;
  let newDeaths=0;
  let newRecovered=0;
  fetch(url + '/summary').then((d)=>{
     return d.json(); 
  }).then(data=>{
     let tempFilteredArray=[];
     tempFilteredArray=data.Countries.filter((item)=>{
      return item.Country===this.state.selectedCountry ; 
    });
    tempFilteredArray.map(item=>{
      return (
                countryName=item.Country,
                totalConfirmed= item.TotalConfirmed,
                totalDeath=item.TotalDeaths,
                totalRecovered=item.TotalRecovered,
                newConfirmed=item.NewConfirmed,
                newDeaths=item.NewDeaths,
                newRecovered=item.NewRecovered
      )
    });

    this.setState({
      TotalConfirmed: totalConfirmed,
      NewlyConfirmed:newConfirmed,
      TotalDeath:totalDeath,
      NewlyDeath:newDeaths,
      TotalRecovered:totalRecovered,
      NewRecovered:newRecovered
    });

    console.log(totalRecovered,totalConfirmed,totalDeath,newConfirmed, newDeaths, newRecovered,countryName);
  }).catch(errorOnGetCountryOnchange=>{console.log(errorOnGetCountryOnchange);});
}
}
getCountry(){
  let tempArray=[];
   fetch(url +'/countries').then(d=>{
    return d.json();
   }).then(data=>{
    tempArray=data.map((item,i)=>{
        return [item.Country];     
       })
       this.setState({Countries:tempArray});   
   }).catch(errorOnFetch=>{
      console.log(errorOnFetch);
   });
}

getSummary(){
  let totalCon=0;
  let newCon=0;
  let totalDeth=0;
  let newDeth=0;
  let totalRec=0;
  let  newRec=0;
  fetch(url + '/summary').then(d=>{
    return d.json();
  }).then(data=>{
    data.Countries.map((item,i)=>{
        return (  totalCon += item.TotalConfirmed,
                  newCon += item.NewConfirmed,
                  totalDeth += item.TotalDeaths,
                  newDeth+=item.NewDeaths,
                  totalRec +=item.TotalRecovered,
                  newRec+=item.NewRecovered
                );
     })
        this.setState({
            TotalConfirmed: totalCon,
            NewlyConfirmed:newCon,
            TotalDeath:totalDeth,
            NewlyDeath:newDeth,
            TotalRecovered:totalRec,
            NewRecovered:newRec

        });
  }).catch(errorOnSummary=>{
    console.log( "errorOnSummary :", errorOnSummary);
  });
}

selectedCountryName(event){
  var selectElement = event.target;
  var value = selectElement.value;
  alert(value);
  this.setState({
      selectedCountry:event.target.value
  });
}
  render(){
    const {Countries}=this.state;
      let countryList = Countries.length > 0 && Countries.map((item,i)=>{
            return (
                <option key={i}> {item!=""?item:"Select a Country"} </option>
            )
      },this);
    return(
        <div>
          <h1 className="title">All Country Covid-19 Tracker</h1>
          <div className="container"> 
            <div className="div1">
              <div className="total-confirmed-div">Total Confirmed  <br/> <br/> <span className="data-confirmed"> {this.state.TotalConfirmed} </span> </div>
              <div className="newly-confirmed-div"> Newly Confirmed <br/> <br/> <span className="data-confirmed"> {this.state.NewlyConfirmed} </span></div>
            </div>
            <div className="div2">
              <div className="total-death-div"> Total Death <br/> <br/> <span className="data-death"> {this.state.TotalDeath} </span></div>
              <div className="newly-death-div"> Newly Death <br/> <br/> <span className="data-death"> {this.state.NewlyDeath} </span></div>
            </div>
            <div className="div3">
              <div className="total-recovered-div">Total Recovered <br/> <br/> <span className="data-recovered"> {this.state.TotalRecovered} </span></div>
              <div className="newly-recovered-div"> Newly Recovered <br/> <br/> <span className="data-recovered"> {this.state.NewRecovered} </span></div>
            </div>

            <div className="drop-down-box-div">
              <br/>
              <br/>
                    <select id="country" onChange={(e)=> {this.setState({ selectedCountry: e.target.value});}} onClick={this.getCountryOnChangeOfDropdown}>
                          {countryList}
                    </select>
            </div>
          </div>
        </div>
    );
  }

}

export default App ;