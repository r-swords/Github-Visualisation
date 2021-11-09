import React from 'react'
//
import { Chart } from 'react-charts'

function Line ({unData}){
  const series = React.useMemo(
    () => ({
      showPoints: false
    }),
    []
  )

  const data = React.useMemo(
    () => [
      {
        label: 'Commit Count',
        data: unData
      }

    ],
    [],
    console.log(data)
  )
  const axes = React.useMemo(
    () => [
      { primary: true, type: 'date', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
  return (
    <Chart data={data} series={series} axes={axes} tooltip />
  )
}

export default Line
