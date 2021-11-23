import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import Line from './Line.js';
import Bar from './Bar.js';
import repo from './repofile.json';
import contrib from './contribfile.json';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { VictoryPie} from 'victory';
import { Dropdown,DropdownButton } from 'react-bootstrap';



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
        <Bar/>
      </div>
      <div style={{ width: '500px', height: '300px'}}>
        <Line/>
      </div>
      <div className = "repo-dropdown">
        <DropdownButton id="dropdown-basic-button" title="Select Contributor" onSelect={handleSelect}>
          {getMenuItems(contributors)}
        </DropdownButton>
      </div>
      <h4>"The person selected is {selected}"</h4>

    </div>
  );
}

export default App;
