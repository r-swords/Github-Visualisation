import React from 'react'
import { Chart } from 'react-charts'
import contrib from './data/contribfile.json';
import { useState, useEffect } from 'react';

function Bar (){

  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    setContributorData(contrib);
  }, [])

  // process data for bar chart
  const setContributorData = (data) => {
    var arr = [];
    Object.keys(data).forEach(key => arr.push([data[key].login, data[key].contributions]));
    setContributors(arr);
  }
  // set chart type
  const barSeries = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )
  // set data for chart
  const contribChartData = React.useMemo(
    () => [
      {
        label: 'Contributor Count',
        data: contributors
      }
    ],
    [contributors]
  )
  // set axes for chart
  const barAxes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'linear', position: 'left', stacked: true }
    ],
    []
  )
  return (
    <Chart data={contribChartData} series={barSeries} axes={barAxes} tooltip />
  )
}

export default Bar;
