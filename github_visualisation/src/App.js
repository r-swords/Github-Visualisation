import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import repo from './repofile.json';
import contrib from './contribfile.json';
import commit from './commitfile.json';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {VictoryBar, VictoryPie, VictoryChart, VictoryArea} from 'victory';
import { Dropdown,DropdownButton, MenuItem } from 'react-bootstrap';
import { Chart } from 'react-charts'



function App() {
  const [name, setName] = useState('name');
  var [languages, setLanguages] = useState([]);
  var [languageArray, setLanguageArray] = useState([]);
  var [contributors, setContributors] = useState([]);
  var [commits, setCommits] = useState([]);
  var [selected, setSelected] = useState('');


  useEffect(() => {
    setContributorData(contrib);
    fetch("https://api.github.com/repos/r-swords/LCAJava/languages")
      .then(res => res.json())
      .then(data => setLanguageData(data));
    setCommitData(commit);
  }, [])


  const setLanguageData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push({x: key, y: data[key]}));
    setLanguages(arr);
  }

  const setContributorData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push([data[key].login, data[key].contributions]));
    console.log(arr[0][0]);
    setContributors(arr);
  }

  const setCommitData = (data) => {
    var obj = {};
    for(var commit in data){
      var commitDate = new Date(data[commit].commit.committer.date.substring(0,10));
      if(obj[commitDate]){
          obj[commitDate]++;
      }
      else {
        obj[commitDate] = 1;
      }
    }
    var arr = [];
    for(var node in obj){
        arr.push({x: new Date(node), y: obj[node]})
    }
    var arr2 = [];
    var currentDate = arr[arr.length - 1].x;
    var max = arr[0].x;
    while(currentDate <= max){
      var count;
      if(obj[currentDate]){
        count = obj[currentDate];
      }
      else{
        count = 0;
      }
      arr2.push([new Date(currentDate),count]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setCommits(arr2);
  }

  const commitChartData = React.useMemo(
    () => [
      {
        label: 'Commit Count',
        data: commits
      }
    ],
    []
  )

  const contribChartData = React.useMemo(
    () => [
      {
        label: 'Contributor Count',
        data: contributors
      }
    ],
    []
  )

  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )

  const barSeries = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  const lineAxes = React.useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  const barAxes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left', stacked: true }
    ],
    []
  )

  const getMenuItems = (contrib) => {
    let menuItems = [];
    for(var i = 0; i < contrib.length; i++){
      menuItems.push(<Dropdown.Item eventKey={contrib[i][0]}>{contrib[i][0]}</Dropdown.Item>);
    }
    return menuItems;
  }

  const handleSelect=(e)=>{
    console.log(e);
    setSelected(e)
  }

  return (
    <div className="App">
      <h1>{repo.name}</h1>
      <div style={{ width: '500px', height: '300px'}}>
        <VictoryPie
          data={languages}
        />
      </div>
      <div style={{ width: '500px', height: '300px'}}>
        <Chart data={contribChartData} series={barSeries} axes={barAxes} tooltip />
      </div>
      <div style={{ width: '500px', height: '300px'}}>
        <Chart data={commitChartData} series={series} axes={lineAxes} tooltip />
      </div>
      <div className = "repo-dropdown">
        <DropdownButton id="dropdown-basic-button" title="Dropdown button" onSelect={handleSelect}>
          {getMenuItems(contributors)}
        </DropdownButton>
      </div>
      <h4>"The person selected is {selected}"</h4>

    </div>
  );
}

export default App;
