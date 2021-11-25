import React from 'react'
//
import { Chart } from 'react-charts'

function UserBar ({ data }){


  const barSeries = React.useMemo(
    () => ({
      type: 'bar'
    }),
    []
  )

  const contribChartData = React.useMemo(
    () => [
      {
        label: 'Language used',
        data: data
      }
    ],
    [data]
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

export default UserBar;
