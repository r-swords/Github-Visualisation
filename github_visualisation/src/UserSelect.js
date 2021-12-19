import React from 'react'
import { useState, useEffect } from 'react';
import UserLine from './UserLine.js';
import contrib from './contribfile.json';
import commit from './commitfile.json';
import users from './userfile.json';
import userRepo from './userrepofile.json';
import UserBar from './UserBar.js'
import ReactDOM from 'react-dom';
import ResizableBox from './ResizableBox.js'
import './App.css';
import { Dropdown,DropdownButton,Card,ListGroup,ListGroupItem } from 'react-bootstrap';



function UserSelect() {
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [language, setLanguage] = useState([]);
  const [userSelectedName, setUserSelectedName] = useState('');
  const [userSelected, setUserSelected] = useState({});
  const [selected, setSelected] = useState(false);


  useEffect(() => {
    setContributorData(contrib);
  }, [])

  const setCommitsData = (data, name) => {
    var obj = {};
    for(var com in data){
      var commitDate = new Date(data[com].commit.committer.date.substring(0,10));
      if(data[com].author !== null){
        if(obj[commitDate] && name === data[com].author.login){
          obj[commitDate]++;
        }
        else if (name === data[com].author.login){
          obj[commitDate] = 1;
        }
     }
    }
    var arr = [];
    for(var node in obj){
        arr.push({x: new Date(node), y: obj[node]})
    }
    var arr2 = [];
    var currentDate = new Date(data[data.length - 1].commit.committer.date.substring(0,10));
    var max = new Date(data[0].commit.committer.date.substring(0,10));
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

  const setLanguageData = (data, name) => {
    var obj = {};
    console.log(data);
    for(var use in data){
      for(var repo in data[use]){
        if(data[use][repo].language !== null){
          if(name === data[use][repo].owner.login && obj[data[use][repo].language]) obj[data[use][repo].language]++;
          else if(name == data[use][repo].owner.login) obj[data[use][repo].language] = 1;
        }
      }
    }
    var arr = [];
    Object.keys(obj).forEach(key => arr.push([key, obj[key]]));
    setLanguage(arr);
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
      if(users[user].login === e){
        newObject = users[user];
      }
    }
    for(var con in contributors){
      if(contributors[con][0] === e){
        newObject = {...newObject, contributions: contributors[con][1]}
      }
    }
    setUserSelected(newObject);
    setCommitsData(commit, e);
    setLanguageData(userRepo, e);
    setSelected(true);
  }

  return (
      <div className = "repo-dropdown">
        <DropdownButton id="dropdown-basic-button" title="Select Contributor" onSelect={handleSelect}>
          {getMenuItems(contributors)}
        </DropdownButton>
        {selected &&
          <>
          <div class="centre">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={userSelected.avatar_url} />
            <Card.Body>
              <Card.Title>{userSelectedName}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>{userSelected.followers} Followers</ListGroupItem>
              <ListGroupItem>{userSelected.following} Following</ListGroupItem>
              <ListGroupItem>{userSelected.public_repos} Repos</ListGroupItem>
              <ListGroupItem>{userSelected.contributions} Contributions</ListGroupItem>
            </ListGroup>
          </Card>
          </div>
          <div class="float-container">
            <div class="float-child">
              <ResizableBox>
                Commits Timeline
                <UserLine data={commits}/>
              </ResizableBox>
            </div>
            <div class="float-child">
              <ResizableBox class="float-child">
                Languages used in users repositories
                <UserBar data={language}/>
              </ResizableBox>
            </div>
          </div>
          </>
          }
      </div>
  );
}

export default UserSelect;
