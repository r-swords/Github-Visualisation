import { useState, useEffect } from 'react';
import './App.css';
import repo from './repofile.json';
import contrib from './contribfile.json';
import commit from './commitfile.json';
import ReactDOM from 'react-dom';
import {VictoryBar, VictoryPie, VictoryChart, VictoryArea} from 'victory';



function App() {
  const [name, setName] = useState('name');
  var [languages, setLanguages] = useState([]);
  var [languageArray, setLanguageArray] = useState([]);
  var [contributors, setContributors] = useState([]);
  var [commits, setCommits] = useState([]);


  useEffect(() => {
    setContributorData(contrib);
    fetch("https://api.github.com/repos/r-swords/LCAJava/languages")
      .then(res => res.json())
      .then(data => setLanguageData(data));
    setCommitData(commit);
  }, [])


  const setLanguageData = (data) => {
    var arr = [];
    console.log(data);
    Object.keys(data).forEach(key => arr.push({x: key, y: data[key]}));
    console.log(arr);
    setLanguages(arr);
  }

  const setContributorData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push({x: data[key].login, y: data[key].contributions}));
    console.log(arr);
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
    console.log(obj);
    for(var node in obj){
        arr.push({x: new Date(node), y: obj[node]})
    }
    var arr2 = [];
    var min = arr[arr.length - 1].x;
    var max = arr[0].x;
    var currentDate = min;
    while(currentDate <= max){
      var count;
      if(obj[currentDate]){
        count = obj[currentDate];
      }
      else{
        count = 0;
      }
      console.log(currentDate);
      arr2.push({x: new Date(currentDate), y: count});
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setCommits(arr2);
    console.log(arr);
    console.log(arr2);
  }



  function setTheLanguages(){

  }

  return (
    <div className="App">
      <h1>{repo.name}</h1>
      <div>
        <VictoryPie
          data={languages}
        />
      </div>
      <VictoryChart>
        <VictoryBar
          data={contributors}
          style={{
            labels: {fontSize: 1, padding: 5}
          }}
        />
      </VictoryChart>
      <VictoryChart>

        <VictoryArea
          data={commits}
          style={{
            labels: {fontSize: 1, padding: 5}
          }}
        />
      </VictoryChart>
    </div>
  );
}

export default App;
