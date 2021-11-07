import { useState, useEffect } from 'react';
import './App.css';
import repo from './repofile.json';
import contrib from './contribfile.json';
import ReactDOM from 'react-dom';
import {VictoryBar, VictoryPie, VictoryChart} from 'victory';



function App() {
  const [name, setName] = useState('name');
  var [languages, setLanguages] = useState([]);
  var [languageArray, setLanguageArray] = useState([]);
  var [contributors, setContributors] = useState([]);


  useEffect(() => {
    setContributorData(contrib);
    fetch("https://api.github.com/repos/r-swords/LCAJava/languages")
      .then(res => res.json())
      .then(data => setLanguageData(data));
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



  function setTheLanguages(){

  }

  return (
    <div className="App">
      <h1>{repo.name}</h1>

      <VictoryPie
        data={languages}
      />
      <VictoryChart>
        <VictoryBar
          data={contributors}
        />
      </VictoryChart>
    </div>
  );
}

export default App;
