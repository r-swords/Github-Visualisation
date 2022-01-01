import React from 'react'
//
import { Chart } from 'react-charts'
import commit from './commitfile.json'
import { useState, useEffect } from 'react';

function Line (){

  const [commits, setCommits] = useState([]);


  useEffect(() => {
    setCommitsData(commit);
  }, [])

  // process data for chart
  const setCommitsData = (data) => {
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
  // set chart type
  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )
  // set chart data
  const commitData = React.useMemo(
    () => [
      {
        label: 'Commit Count',
        data: commits
      }
    ],
    [commits],
  )
  // set chart axes
  const lineAxes = React.useMemo(
    () => [
      { primary: true, type: 'utc', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
    <Chart data={commitData} series={series} axes={lineAxes} tooltip/>
  )

}

export default Line
