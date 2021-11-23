import React from 'react'
//
import { Chart } from 'react-charts'
import contrib from './contribfile.json';
import { useState, useEffect } from 'react';

function Bar (){

  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    setContributorData(contrib);
  }, [])

  const setContributorData = (data) => {
    var arr = [];
    console.log(data);
    Object.keys(data).forEach(key => arr.push([data[key].login, data[key].contributions]));
    console.log(arr[0][0]);
    setContributors(arr);
  }

  const barSeries = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  const contribChartData = React.useMemo(
    () => [
      {
        label: 'Contributor Count',
        data: contributors
      }
    ],
    [contributors]
  )

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
