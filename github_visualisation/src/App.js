import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import Line from './Line.js';
import Bar from './Bar.js';
import UserSelect from './UserSelect';
import Scatter from './Scatter';
import repo from './repofile.json';
import ReactDOM from 'react-dom';
import { VictoryPie} from 'victory';



function App() {
  const [name, setName] = useState('name');
  const [languages, setLanguages] = useState([]);
  const [languageArray, setLanguageArray] = useState([]);


  useEffect(() => {
    fetch("https://api.github.com/repos/r-swords/Github-Visualisation/languages")
      .then(res => res.json())
      .then(data => setLanguageData(data));
  }, [])


  const setLanguageData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push({x: key, y: data[key]}));
    setLanguages(arr);
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
        <Bar/>
      </div>
      <div style={{ width: '500px', height: '300px'}}>
        <Line/>
      </div>
      <div style={{ width: '500px', height: '300px'}}>
        <Scatter/>
      </div>
      <UserSelect/>

    </div>
  );
}

export default App;
