import React from 'react'
//
import { Chart } from 'react-charts'
import commit from './data/commitfile.json'
import contrib from './data/contribfile.json'
import { useState, useEffect } from 'react';

function Scatter (){

  const [commits, setCommits] = useState([]);
  



  useEffect(() => {
    var arr = [];
    for(var con in contrib){
      arr.push(createLabel(setCommitsData(commit,contrib[con].login), contrib[con].login));
    }
    setCommits(arr);
  }, [])


  // proccess data for chart
  const setCommitsData = (data, name) => {
    var obj = {};
    var comCount = 0;
    var actCount = 0;
    for(var commit in data){
      var commitDate = new Date(data[commit].commit.committer.date.substring(0,10));
      if(data[commit].author !== null && data[commit].author.login === name){
        if(!obj[commitDate]){
          obj[commitDate] = 1;
          actCount++;
        }
        comCount++;
      }
    }
    if(actCount > 0){
      var ratio = (comCount/actCount)
      var arr = [comCount, actCount, ratio];
      return arr;
    }
    return null;
  }
  // set chart type
  const series = React.useMemo(
    () => ({
      type: 'bubble',
      showPoints: false
    }),
    []
  )
  // set chart data
  const createLabel = (array, label) =>{
    return {
      label: label,
      data: [array]
    }
  }
  // set chart axes
  const bubbleAxes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <Chart data={commits} series={series} axes={bubbleAxes} grouping='single' tooltip/>

  )

}

export default Scatter
