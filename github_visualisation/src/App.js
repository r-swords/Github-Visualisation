import React from 'react'
import { useState, useEffect } from 'react';
import './App.css';
import Line from './Line.js';
import Bar from './Bar.js';
import repo from './repofile.json';
import contrib from './contribfile.json';
import users from './userfile.json'
import ReactDOM from 'react-dom';
import { VictoryPie} from 'victory';
import { Dropdown,DropdownButton } from 'react-bootstrap';
import { Card, Icon, Image } from 'semantic-ui-react'



function App() {
  const [name, setName] = useState('name');
  const [languages, setLanguages] = useState([]);
  const [languageArray, setLanguageArray] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [userSelectedName, setUserSelectedName] = useState('');
  const [userSelected, setUserSelected] = useState({});
  const [selected, setSelected] = useState(false);


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
    setUserSelectedName(e);
    var newObject = {};
    for(var user in users){
      console.log(users[user].login);
      console.log(e);
      if(users[user].login === e){
        newObject = users[user];
      }
    }
    console.log(newObject);
    for(var con in contributors){
      if(contributors[con][0] === e){
        newObject = {...newObject, contributions: contributors[con][1]}
      }
    }
    console.log(newObject);
    setUserSelected(newObject);
    setSelected(true);
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
        {selected && <Card>
          <Image src={userSelected.avatar_url} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{userSelectedName}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              {userSelected.followers} Followers
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              {userSelected.following} Following
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='folder' />
              {userSelected.public_repos} Repos
            </a>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='upload' />
              {userSelected.contributions} Contributions
            </a>
          </Card.Content>
        </Card>}
      </div>


    </div>
  );
}

export default App;
