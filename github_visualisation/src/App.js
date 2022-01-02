import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import Line from './Line.js';
import Bar from './Bar.js';
import UserSelect from './UserSelect';
import Scatter from './Scatter';
import ResizableBox from './ResizableBox.js'
import repo from './data/repofile.json';
import ReactDOM from 'react-dom';
import { VictoryPie} from 'victory';



// ENTER USERNAME AND REPO HERE!!!!!!!!!!
const repoUser = "USERNAME"
const mainRepo = "REPOSITORY"



function App() {
  const [languages, setLanguages] = useState([]);

// get data for pie chart
  useEffect(() => {
    fetch("https://api.github.com/repos/"+repoUser+"/"+mainRepo+"/languages")
      .then(res => res.json())
      .then(data => setLanguageData(data));
  }, [])

// process data for pie char
  const setLanguageData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push({x: key, y: data[key]}));
    setLanguages(arr);
  }




  return (
    <div className="App" class="container">
      <h1>{repo.name}</h1>
      <div class="float-container">
        <div class="float-child">
          <ResizableBox>
            Languages Used
            <VictoryPie
              data={languages}
            />
          </ResizableBox>
        </div>
        <div class="float-child">
          Contributions Made (y-axis) vs Contributor (x-axis)
          <ResizableBox>
            <Bar/>
          </ResizableBox>
        </div>
      </div>
      <div class="float-container">
        <div class="float-child">
          <ResizableBox>
            Number of Commits (y-axis) vs Date (x-axis)
            <Line/>
          </ResizableBox>
        </div>
        <div class="float-child">
          <ResizableBox>
            Active Days (y-axis) vs Commits (x-axis) per contributor
            <Scatter/>
          </ResizableBox>
        </div>
      </div>
      <div class="float-container">
        <UserSelect/>
      </div>

    </div>
  );
}

export default App;
